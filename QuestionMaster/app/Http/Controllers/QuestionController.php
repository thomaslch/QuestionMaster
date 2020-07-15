<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Question;

class QuestionController extends Controller
{
    /**
     * @func create
     * @desc add a new record to the question table
     * 
     */
    public function create(Request $request){
        $validate = $request->validate([
            'name' => 'required|string',
            'answer' => 'required|integer',
            'option_1' => 'required|string',
            'option_2' => 'required|string',
            'option_3' => 'required|string',
            'option_4' => 'required|string',
        ]);

        $question = new Question;
        $question->question = $request->name;
        $question->answer = $request->answer;
        $question->option_1 = $request->option_1;
        $question->option_2 = $request->option_2;
        $question->option_3 = $request->option_3;
        $question->option_4 = $request->option_4;

        $question->save();

        // broadcast question
        broadcast(new \App\Events\QuestionCreated($question, false));

        response()->json($question, 201);

        sleep(15);

        // broadcast question and ans
        broadcast(new \App\Events\QuestionCreated($question, true));

        return;
    }
}
