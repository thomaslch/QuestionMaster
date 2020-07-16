import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ProgressBar from 'react-bootstrap/ProgressBar';

import socketio from 'socket.io-client';

const DURATION = 10 * 1000;
const STEP = 100;
const DISPLAY_QUESTION = 10;
const DISPLAY_ANSWER = 20;

var socket;
var userID, token;

const UserView = () => {
  const [message, setMessage] = useState("");
  const [counter, setCounter] = useState(0);
  const [triggerCounter, setTriggerCounter] = useState(false);
  const [displayMode, setDisplayMode] = useState(DISPLAY_QUESTION);
  const [selectedOption, setSelectedOption] = useState(0);

  useEffect(() => {
    // connect to socket server and wait for questions
    // once a question arrives, put it in state and trigger counter
    socket = socketio('http://thomas-ubuntu.local:3000', {transports: ['websocket'], upgrade: false});
    socket.on("channel-question.1:App\\Events\\QuestionCreated", function (message) {
      setMessage(message)
      // console.log(message);
      if (message?.answer == undefined) {
        setTriggerCounter(true);
        setSelectedOption(0);
        setDisplayMode(DISPLAY_QUESTION);
      } else {
        setDisplayMode(DISPLAY_ANSWER);
      }
    });
    token = document.getElementById('jwt_token')?.innerHTML;
    userID = document.getElementById('user_id')?.innerHTML;

  }, [])

  // handle counter events
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

  // handle options onclick
  const handleOptionClick = (option) => {
    if (displayMode == DISPLAY_QUESTION) {
      setSelectedOption(option);
      var response = {
        token: token,
        question_id: message?.id,
        answer: option
      }
      // send the selected choice to server
      socket.emit("channel-answer.1", JSON.stringify(response));
    }
  }


  return (
    <>
      {message == ""
        ?
        // show waiting message until the first question arrives
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-grow m-2" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="m-2">Stay tuned for questions!</div>
        </div>
        :
        // main card body
        <>
          <ProgressBar now={counter} max={DURATION} />
          <div className="card">
            <div className="card-header">
              <div>{message?.name}</div>
            </div>
            <div className="card-body">
              {/* render options div */}
              {[...Array(4)].map((x, i) => (
                <div
                  onClick={() => handleOptionClick(i + 1)}
                  style={{
                    ...styles.clickable_option,
                    ...selectedOption == (i + 1) && styles.selected_option,
                    ...message?.answer && selectedOption == (i + 1) && selectedOption == message?.answer && styles.correct_answer,
                    ...message?.answer && selectedOption == (i + 1) && selectedOption != message?.answer && styles.wrong_answer,
                    ...message?.answer && selectedOption != message?.answer && message?.answer == (i + 1) && styles.correct_answer,
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
    cursor: "pointer",
  },
  selected_option: {
    backgroundColor: "#e2e3e5",
    color: "#383d41"
  },
  correct_answer: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    color: "#155724",
  },
  wrong_answer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    color: "#721c24",
  },

}

export default UserView;

if (document.getElementById('user-view')) {
  ReactDOM.render(<UserView />, document.getElementById('user-view'));
}