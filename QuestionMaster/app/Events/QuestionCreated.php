<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class QuestionCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $question;
    public $showAns;

    /**
     * Create a new event instance.
     *
     * @param question array of question contents
     * @return void
     */
    public function __construct($question, $showAns)
    {
        $this->question = $question;
        $this->showAns = $showAns;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('channel-question.1');
    }

    public function broadcastWith(){
        $array = [
            'id' => $this->question->id,
            'name' => $this->question->question,
            'option_1' => $this->question->option_1,
            'option_2' => $this->question->option_2,
            'option_3' => $this->question->option_3,
            'option_4' => $this->question->option_4,
        ];

        if($this->showAns) $array['answer'] = $this->question->answer;

        return $array;
    }
}
