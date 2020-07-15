import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ProgressBar from 'react-bootstrap/ProgressBar';

import socketio from 'socket.io-client';

const DURATION = 10 * 1000;
const STEP = 100;
const DISPLAY_QUESTION = 10;
const DISPLAY_ANSWER = 20;

var socket;

const UserView = () => {
  const [message, setMessage] = useState("");
  const [counter, setCounter] = useState(0);
  const [triggerCounter, setTriggerCounter] = useState(false);
  const [displayMode, setDisplayMode] = useState(DISPLAY_QUESTION);
  const [selectedOption, setSelectedOption] = useState(0);

  useEffect(() => {
    socket = socketio('http://thomas-ubuntu.local:3000');
    socket.on("channel-question.1:App\\Events\\QuestionCreated", function (message) {
      setMessage(message)
      console.log(message);
      if (message?.answer == undefined) {
        setTriggerCounter(true);
        setSelectedOption(0);
        setDisplayMode(DISPLAY_QUESTION);
      } else {
        setDisplayMode(DISPLAY_ANSWER);
      }
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
    if (displayMode == DISPLAY_QUESTION) {
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
              {[...Array(4)].map((x, i) => (
                <div
                  onClick={() => handleOptionClick(i + 1)}
                  style={{
                    ...styles.clickable_option, 
                    ...selectedOption==(i+1) && styles.selected_option,
                    ...message?.answer && selectedOption==(i+1) && selectedOption==message?.answer && styles.correctAnswer,
                    ...message?.answer && selectedOption==(i+1) && selectedOption!=message?.answer && styles.wrongAnswer,
                    ...message?.answer && selectedOption!=message?.answer && message?.answer==(i+1) && styles.correctAnswer,
                  }}
                  key={"option_" + (i + 1)}
                >
                  {message?.["option_" + (i + 1)]}
                </div>
              ))}
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
    borderColor: "#d6d8db",
    borderWidth: 1,
    borderRadius: 16,
    borderStyle: "solid",
  },
  selected_option: {
    backgroundColor: "#e2e3e5",
    color: "#383d41"
  },
  correctAnswer: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    color: "#155724",
  },
  wrongAnswer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    color: "#721c24",
  },

}

export default UserView;

if (document.getElementById('user-view')) {
  ReactDOM.render(<UserView />, document.getElementById('user-view'));
}