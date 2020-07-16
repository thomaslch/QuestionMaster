const REDIS_HOST = "thomas-ubuntu.local";
const JWT_SECRET = "T0lKisoQdYWfFuY5aCdlyQXmDVuJEbg5FuaDyCQjM1qND0VtQeGmWMBeTL2bHWdR";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.set("transports", ["websocket"]);

var Redis = require('ioredis');
var redis = new Redis(REDIS_HOST);
var pub = new Redis(REDIS_HOST);

var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var sql = mysql.createConnection({
	host: "thomas-ubuntu.local",
	port: 3360,
	user: "root",
	password: "noopasswordhahalol",
	database: "qm"
});
sql.connect(err => {
	if (err) throw err;
	console.log("Database connected");
})

redis.subscribe('channel-question.1', function (err, count) {
});

redis.on('message', function (channel, message) {
	// received broadcast from redis, put it on socket
	message = JSON.parse(message);
	io.emit(channel + ':' + message.event, message.data);
});

io.on('connection', socket => {
	socket.on('channel-answer.1', data => {
		try {
			data = JSON.parse(data);
			var result = jwt.verify(data && data.token, JWT_SECRET);
			var userID = result && result.sub;
			var questionID = data && data.question_id;
			var answer = data && data.answer;
			console.log("Received input from user_id=" + userID + " , question_id=" + questionID + ", answer=" + answer);
			var query = `INSERT INTO user_entry (user_id, question_id, choice, created_at, updated_at) VALUES (${userID}, ${questionID}, ${answer}, NOW(), NOW())`;
			sql.query(query, (err, result) => {
				if(err) console.error(err);
				console.log("Insert OK");
			});

		} catch (e) {
			console.error(e);
		}
	})
})

http.listen(3000, function () {
	console.log('Listening on Port 3000');
});
