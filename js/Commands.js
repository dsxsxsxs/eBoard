var CommandsClass = function(socket){
	if (!this instanceof CommandsClass)return new CommandsClass;

	var cmdBuf=[], timer, session;
	var current={};
	socket.on('joined', function(data){
		session=data.session;
	});
	socket.on('new_client', function(data){
		current[data.session]={};
	});
	socket.on('close', function(data){
		current[data.session]=null;
	});	
	socket.on('cmd', function(data){
		// cmdBuf.push(data);
		execCmd(data);
	});
	socket.on('resize', function(data){
		CsCtrl.setPanelSize(data.w, data.h);
	});
	this.sendPanelSize=function(w, h){
		socket.emit('resize',{w: w, h: h});
	};
		
		
	var newCmd = function(data){
		socket.emit('cmd',data);
	};
	var execCmd = function(cmd){
		switch (cmd.op){
			case 'm':
				current[cmd.s]=cmd;
				break;
			case 'l':
				if (current[cmd.s]===undefined)
					 current[cmd.s]=cmd;
				else {
					CsCtrl.drawLine(
						cmd.c,
						cmd.l,
						current[cmd.s].x,
						current[cmd.s].y,
						cmd.x,
						cmd.y
					);
					current[cmd.s]=cmd;
				}
				break;
		}
	};
	var parse = function(){
		if (cmdBuf.length<=0)return;
		var cmd=cmdBuf.shift();
		// console.log(cmd);
		switch (cmd.op){
			case 'm':
				current[cmd.s]=cmd;
				break;
			case 'l':
				if (current[cmd.s]===undefined)
					 current[cmd.s]=cmd;
				else {
					CsCtrl.drawLine(
						cmd.c,
						cmd.l,
						current[cmd.s].x,
						current[cmd.s].y,
						cmd.x,
						cmd.y
					);
					current[cmd.s]=cmd;
				}
				break;
		}
	};
	this.newMoveToCmd = function(x, y){
		newCmd({op: 'm', x: x, y: y, s:session});
	};
	this.newLineToCmd = function(x, y, c, l){
		newCmd({op: 'l', x: x, y: y, c: c, l: l, s:session});
	};
	this.stop=function(){
		clearInterval(timer);
	};
	this.start=function(){
		timer=setInterval(parse, 20);
		debug('parser: '+timer);
	};


	// this.start();
};