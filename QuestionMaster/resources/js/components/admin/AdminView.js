import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import QuestionCard from './QuestionCard';

const AdminView = () => {
  const [questions, setQuestions] = useState([]);

  // append QuestionCard element to a list when button is clicked
  const newQuestions = () => {
    var now = new Date();

    setQuestions([...questions, (<QuestionCard key={now.toString()} />)]);
  }

  return (
    <>
      <div className="card">
        <div className="row card-body">
          <div className="p-3 flex-grow-1 d-flex align-items-center">
            <div style={{ fontWeight: "900" }}>Welcome, Admin</div>
          </div>
          <div className="p-3 d-flex justify-content-end" >
            <button type="button" className="btn btn-primary" onClick={newQuestions}>
              New Question
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {questions.length == 0 &&
        <div className="d-flex justify-content-center">
          <div>You don't have any questions.</div>
        </div>
      }

      {questions}

    </>
  )
};

export default AdminView;

if (document.getElementById('admin-view')) {
  ReactDOM.render(<AdminView />, document.getElementById('admin-view'));
}