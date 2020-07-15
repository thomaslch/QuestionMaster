const REDIS_HOST = "thomas-ubuntu.local";
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Redis = require('ioredis');
var redis = new Redis(REDIS_HOST);
var pub = new Redis(REDIS_HOST);

redis.subscribe('channel-question.1', 'channel-answer.1', function (err, count) {
});

redis.on('message', function (channel, message) {
    // received broadcast from redis, put it on socket
    console.log('Message Recieved: ' + message);
    message = JSON.parse(message);
    io.emit(channel + ':' + message.event, message.data);
});

io.on('connection', socket => {
    socket.on('laravel_database_channel.1', data => {
        console.log(data);
        pub.publish("laravel_database_channel.2", data);
    })
})

http.listen(3000, function () {
    console.log('Listening on Port 3000');
});
