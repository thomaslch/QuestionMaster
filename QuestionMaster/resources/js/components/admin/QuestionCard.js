import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import GLOBALS from '../../api/global';

const QuestionCard = (key) => {
  const [questionInput, setQuestionInput] = useState({});

  const optionRow = () => {
    var options = [];
    for (var i = 0; i < 4; i++) {
      options.push(
        <div className="form-group row" key={key+i}>
          <div className="p-2 col-form-label d-flex justify-content-end align-items-center flex-nowrap">
            <input className="" type="radio" name="answer" value={i+1} onChange={onInputChanged} />
          </div>
          <div className="flex-grow-1 p-2">
            <input className="form-control" name={"option_"+(i+1)} placeholder={"Option "+(i+1)} onChange={onInputChanged} />
          </div>
        </div>
      );
    }
    return options;
  };

  const formSubmit = async event => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(questionInput).forEach(key => {
      formData.append(key, questionInput[key]);
    });
    await fetch(GLOBALS.url+'/api/question', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })
    .then(res => {
      if(!res.ok) throw Error(res.statusText);
      return res;
    })
    .then(res => console.log(res))
    .catch(err => alert(err));
  }

  const onInputChanged = event => {
    setQuestionInput({...questionInput, [event.target.name]: event.target.value});
  }

  return (
    <form onSubmit={formSubmit}>
      <div className="card" style={{ overflow: "hidden" }}>

        <div className="row card-header">
          <div className="p-2 flex-grow-1">
            <input className="form-control" name="name" placeholder="New Question" onChange={onInputChanged} />
          </div>
          <div className="p-2 d-flex justify-content-end">
            <button type="submit" className="btn btn-light">Post</button>
          </div>
        </div>

        <div className="card-body container">{optionRow()}</div>


      </div>

      <div style={{ height: 16 }} />
    </form>
  )
}

export default QuestionCard;