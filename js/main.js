
var DEVICE_TYPE = 'GENERAL';


var settingDsp = 1;

var cs = document.getElementById("drawPanel");
var ctx = cs.getContext("2d");
CsCtrl = new CsCtrlClass(cs, ctx);

var socket = io.connect("http://eboard-dsxs.rhcloud.com"+":8000");
// var socket = io.connect("http://12"+":8000");
function debug(msg){
	socket.emit('debug', msg);
	console.log(msg);
	// alert(msg);
	// $('#status').text(msg);
}

socket.on('connect',function(data){
	console.log('socket.io connected.');
	console.log(data);

});
Commands = new CommandsClass(socket);
socket.on('message', function(msg){
	console.log(msg);
});
socket.on('debug', function(data){
	console.log(data);
});

function eventBinding(){
	document.addEventListener('touchstart', function(e) {
	    e.preventDefault();
	    // debug(e.touches.length);
	    if ( e.touches.length == 3 ){
	    	settingDsp = Math.abs(settingDsp-1);
	    	if ( settingDsp == 0 ){
	    		$('#setting').hide();
	    	}else{
	    		$('#setting').show();
	    	}
	    }
	    var touch = e.touches[0];
	    CsCtrl.penDown(touch.pageX,touch.pageY);
	    // debug("penDown("+touch.pageX+','+touch.pageY+")");
	    // alert(lastY+';'+(cs.height-100));
	    // if ( settingDsp == 0 || (lastY < (cs.height-100)) )
	    // 	socket.send('{op:"dp",x:'+lastX+',y:'+lastY+'}');
	}, false);
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	    if ( e.touches.length == 2 ){
	   		var x = e.touches[1].pageX;
	   		var y = e.touches[1].pageY;
	   		CsCtrl.penMove(x, y, true);
	   	}else{
	   		var touch = e.touches[0];
	    	CsCtrl.penMove(touch.pageX,touch.pageY);
	    	// debug("penMove("+touch.pageX+','+touch.pageY+")");
	    }
	}, false);
	document.addEventListener('touchend', function(e){
		CsCtrl.penUp();
	}, false);

	document.getElementById('WL').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#fff',8);
	}, false);
	document.getElementById('KL').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#000',8);
	}, false);
	document.getElementById('BL').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#00f',8);
	}, false);
	document.getElementById('RL').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#f00',8);
	}, false);

	document.getElementById('WM').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#fff',5);
	}, false);
	document.getElementById('KM').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#000',5);
	}, false);
	document.getElementById('BM').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#00f',5);
	}, false);
	document.getElementById('RM').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#f00',5);
	}, false);

	document.getElementById('WS').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#fff',3);
	}, false);
	document.getElementById('KS').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#000',3);
	}, false);
	document.getElementById('BS').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#00f',3);
	}, false);
	document.getElementById('RS').addEventListener('touchstart', function(e){
		CsCtrl.setPen('#f00',3);
	}, false);

}

$(document).ready(init);
function init(){
	if(navigator.userAgent.indexOf('iPad')>0)
		DEVICE_TYPE = 'PAD';
	if(navigator.userAgent.indexOf('iPhone')>0)
		DEVICE_TYPE = 'PAD';
	if(navigator.userAgent.indexOf('Android')>0)
		DEVICE_TYPE = 'PAD';

	if ( DEVICE_TYPE == 'PAD' ){
		CsCtrl.setPanelSize($(document).width(),$(document).height(), true);
		Commands.sendPanelSize($(document).width(),$(document).height());
		eventBinding();
	}else{
		$('#drawPanel').addClass('displayPanel');
		$('#setting').hide();
	}
}
