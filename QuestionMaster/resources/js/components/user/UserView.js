import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Echo from 'laravel-echo';
import socketio from 'socket.io-client';

const DURATION = 15 * 1000;
const STEP = 100;
const DISPLAY_QUESTION = 10;
const DISPLAY_ANSWER = 20;

const UserView = () => {
  const [message, setMessage] = useState("");
  const [counter, setCounter] = useState(0);
  const [triggerCounter, setTriggerCounter] = useState(false);
  const [displayMode, setDisplayMode] = useState(DISPLAY_QUESTION);
  const [selectedOption, setSelectedOption] = useState(0);
  const [calcOptionStyle, setCalcOptionStyle] = useState([]);

  useEffect(() => {
    const echo = new Echo({
      host: 'http://thomas-ubuntu.local:6001',
      broadcaster: 'socket.io',
      client: socketio
    });
    echo
      .channel('channel-question.1')
      .listen('QuestionCreated', ev => {
        setMessage(ev);
        if(ev?.answer == undefined){
          setTriggerCounter(true);
          setDisplayMode(DISPLAY_QUESTION);
        }else{
          setDisplayMode(DISPLAY_QUESTION);
        }
        console.log(ev);
      });
  }, [])


  useEffect(() => {
    var interval;
    if (triggerCounter == true) {
      interval = setInterval(() => {
        setCounter(counter => {
          if (counter >= DURATION) {
            setTriggerCounter(false);
            clearInterval(interval);
            return 0;
          } else {
            return counter + STEP;
          }
        });
        if (counter >= DURATION) {
          setTriggerCounter(false);
          setCounter(0);
          clearInterval(interval);
        }
      }, STEP);
    }
    return () => clearInterval(interval);
  }, [triggerCounter])

  const handleOptionClick = (option) => {
    if(displayMode == DISPLAY_QUESTION){
      setSelectedOption(option);
    }
    
  }

  return (
    <>
      {message == ""
        ?
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-grow m-2" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="m-2">Stay tuned for questions!</div>
        </div>
        :
        <>
          <ProgressBar now={counter} max={DURATION} />
          <div className="card">
            <div className="card-header">
              <div>{message?.name}</div>
            </div>
            <div className="card-body">
              <div onClick={() => handleOptionClick(1)} style={styles.clickable_option}>{message?.option_1}</div>
              <div onClick={() => handleOptionClick(2)} style={styles.clickable_option}>{message?.option_2}</div>
              <div onClick={() => handleOptionClick(3)} style={styles.clickable_option}>{message?.option_3}</div>
              <div onClick={() => handleOptionClick(4)} style={styles.clickable_option}>{message?.option_4}</div>
              <div>{message?.answer}</div>
            </div>
          </div>
        </>
      }
    </>
  );
}

const styles = {
  clickable_option: {
    margin: 8,
    padding: 8,
    paddingLeft: 16,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 16,
    borderStyle: "solid",
  },
  selected_option: {
    backgroundColor: "#9e9e9e",
    color: "#000"
  }
}

export default UserView;

if (document.getElementById('user-view')) {
  ReactDOM.render(<UserView />, document.getElementById('user-view'));
}