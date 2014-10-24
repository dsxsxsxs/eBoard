var CsCtrl;
var Commands;

var CsCtrlClass = function(cs, ctx){
	if (!this instanceof CsCtrlClass)return new CsCtrlClass;

	var isPenDown=false,
		localPen={
			x: 0,
			y: 0,
			color: '#000',
			lineWidth: 5;
		},
		eraser={
			color: '#fff',
			lineWidth: 25
		};
	ctx.lineCap='round';
	ctx.strokeStyle=localPen.color;
	ctx.lineWidth=localPen.lineWidth;

	this.setPen = function(color, lineWidth){
		if (lineWidth) {
			localPen.lineWidth=lineWidth;
			eraser.lineWidth=lineWidth*5;
		}
		localPen.color=color;
	};
	this.setPanelSize = function(w, h, f){
		if (f || DEVICE_TYPE!=='PAD'){
			cs.width = w;
			cs.height = h;
			$('#drawPanel').width(w);
			$('#drawPanel').height(h);
			this.clear();
		}
	};
	this.clear = function(){
		ctx.fillStyle="#fff";
		ctx.fillRect(0,0,$('#drawPanel').width(),$('#drawPanel').height());
	};
	//==============================================================================
	// PEN
	//==============================================================================
	// Places the pen in the specified location without drawing a line. If the pen
	// subsequently moves, a line will be drawn.
	this.penDown =function(x, y) {
	  isPenDown = true;
	  localPen.x = x;
	  localPen.y = y;
	  Commands.newMoveToCmd(x, y);
	  // Send this user's new pen position to other users.
	  // broadcastMove(x, y);
	}

	// Draws a line if the pen is down.
	this.penMove = function(x, y, isErase) { 
	  if (isPenDown) {
	    
	    // Draw the line locally.
	    if (isErase){
	    	this.drawLine(eraser.color, eraser.lineWidth, localPen.x, localPen.y, x, y);
	    	Commands.newLineToCmd(x, y, eraser.color, eraser.lineWidth);
	    }else {
	    	this.drawLine(localPen.color, localPen.lineWidth, localPen.x, localPen.y, x, y);
	    	Commands.newLineToCmd(x, y, localPen.color, localPen.lineWidth);
	    }
	    
	    // Move the pen to the end of the line that was just drawn.
	    localPen.x = x;
	    localPen.y = y;
	  }
	}

	// "Lifts" the drawing pen, so that lines are no longer draw when the mouse or
	// touch-input device moves.
	this.penUp = function() {
	  isPenDown = false;
	}

	this.drawLine = function(color, thickness, x1, y1, x2, y2) {
	  ctx.strokeStyle = color;
	  ctx.lineWidth   = thickness;
	  
	  ctx.beginPath();
	  ctx.moveTo(x1, y1);
	  ctx.lineTo(x2, y2);
	  ctx.stroke();
	}
};