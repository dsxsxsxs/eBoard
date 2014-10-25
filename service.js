// var io = require('socket.io').listen(8091,{log:true});
// , app = express()
// , server = require('http').createServer(app)

// console.log("Socket.io is running on 8091.");
var express = require('express');
var app = express();
var url = require("url");
var path = require("path");
var userSerial = 0;
var ipAddress  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080;


app.use(express.bodyParser());
var server = app.listen(serverPort, ipAddress, function(){
	//console.log("Express Server is running on "+serverPort+".");
	console.log('%s: Express Server started on %s:%d ...',
		Date(Date.now() ), ipAddress, serverPort);

});

var io = require("socket.io").listen(server);
// console.log("Express Server is running on "+serverPort+".");

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
	socket.emit( 'joined', {sn: userSerial, session: socket.id});
	socket.broadcast.emit("new_client",{sn:userSerial, session: socket.id});
	console.log(userSerial);
	++userSerial;
	console.log(socket.id);
    socket.on('message', function (msg) {
    	console.log(msg);
        socket.broadcast.send(msg);
    });
    socket.on('debug', function (msg) {
    	console.log(msg);
        socket.broadcast.send(msg);
    });
    socket.on('resize', function(data){
    	socket.broadcast.emit( 'resize',data);
    });
    socket.on('cmd', function(data){
    	data.timestamp=Date.now();
    	socket.broadcast.emit( 'cmd',data);
    });
    socket.on('disconnect', function (msg) {
    	console.log(msg);
    	socket.broadcast.emit('close', {session: socket.id});
    	// socket.broadcast.send('{x:0,y:0,clear:true}');
    });
});
