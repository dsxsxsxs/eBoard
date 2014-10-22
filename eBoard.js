var io = require('socket.io').listen(8091,{log:true});

console.log("Socket.io is running on 8091.");
var express = require('express');
var app = express();
var url = require("url");
var path = require("path");
var userSerial = 0;

app.listen(8090);
app.use(express.bodyParser());

console.log("Express Server is running on 8090.");

function fileResp(req, resp){
	console.log(req.headers['user-agent']);
	var urlData = url.parse(req.url,true);
	// console.log(req);
	var action = urlData.pathname;
	var extName = action.split('.').pop();
	// console.log(extName);
	// console.log(action);
	var filename = path.join(process.cwd(), action);
	resp.sendfile(filename);
}

app.get('/libs/*', fileResp);

app.get('/*', fileResp);

io.sockets.on('connection', function (socket) {
	// socket.send('{"session":"'+socket.id+'"}');
	socket.send('{op:"user_serial",sn:"'+userSerial+'"}');
	socket.broadcast.send('{op:"user_login",sn:"'+userSerial+'"}');
	console.log(userSerial);
	++userSerial;
	console.log(socket.id);
    socket.on('message', function (msg) {
    	console.log(msg);
        socket.broadcast.send(msg);
    });
    socket.on('disconnect', function () {
    	// socket.broadcast.send('{x:0,y:0,clear:true}');
    });
});
