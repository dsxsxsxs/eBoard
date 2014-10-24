var CommandsClass = function(socket){
	if (!this instanceof CommandsClass)return new CommandsClass;

	var cmdBuf=[], timer;
	var current=null;

	socket.on('cmd', function(data){
		cmdBuf.push(data);
	});
	socket.on('resize', function(data){
		CsCtrl.setPanelSize(data.w, data.h);
	});
	this.sendPanelSize=function(w, h){
		socket.emit('resize',{w: w, h: h});
	};
		
		
	var newCmd = function(data){
		socket.emit('cmd': data);
	};
	var parse = function(){
		if (cmdBuf.length<=0)return;
		var cmd=cmdBuf.unshift();
		switch (cmd.op){
			case 'm':
				current=cmd;
				break;
			case 'l':
				if (current===undefined)
					 current=cmd;
				else {
					CsCtrl.drawLine(
						cmd.c,
						cmd.l,
						current.x,
						current.y,
						cmd.x,
						cmd.y
					);
					current=cmd;
				}
				break;
		}
	}
	this.newMoveToCmd = function(x, y){
		newCmd({op: 'm', x: x, y: y});
	};
	this.newLineToCmd = function(x, y, c, l){
		newCmd({op: 'l', x: x, y: y, c: c, l: l});
	};
	this.stop=function(){
		clearInterval(timer);
	};
	this.start=function(){
		timer=setInterval(parse, 20);
	};


	this.start();
};