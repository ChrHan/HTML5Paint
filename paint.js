var started = false;
var tool = false;
var tool_default = 'rect';
var tools = {};
var Canvas = {

  draw: function() {
	var tool_select = document.getElementById("dtool");
	if (!tool_select) {
		alert("no tool selected!");
		return;
	}
	tool_select.addEventListener('change', this.eventToolChange, false);
	if (tools[tool_default]) {
		tool = new tools[tool_default]();
		tool_select.value = tool_default;
	}
	
	var canvas = document.getElementById("paint");
	var ctx = canvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	//this.drawRect(ctx, 100, 100, 200, 250, "FF0000");
	//tool = new this.tool_pencil();

	canvas.addEventListener('mousemove', this.eventCanvas, false);
	canvas.addEventListener('mousedown', this.eventCanvas, false);
	canvas.addEventListener('mouseup', this.eventCanvas, false);
  },
	eventToolChange: function(ev) {
		if (tools[this.value]) {
			tool = new tools[this.value]();
		}
	},
  
  // This painting tool works like a drawing pencil which tracks the mouse 
	// movements.
	pencil: function () {
	  var canvas = document.getElementById("paint");
	  var context = canvas.getContext("2d");
	  var tool = this;
	  this.started = false;
	
	  // This is called when you start holding down the mouse button.
	  // This starts the pencil drawing.
	  this.mousedown = function (ev) {
	      context.beginPath();
	      context.moveTo(ev._x, ev._y);
	      tool.started = true;
	  };
	
	  // This function is called every time you move the mouse. Obviously, it only 
	  // draws if the tool.started state is set to true (when you are holding down 
	  // the mouse button).
	  this.mousemove = function (ev) {
	    if (tool.started) {
	      context.lineTo(ev._x, ev._y);
	      context.stroke();
	    }
	  };
	
	  // This is called when you release the mouse button.
	  this.mouseup = function (ev) {
	    if (tool.started) {
	      tool.mousemove(ev);
	      tool.started = false;
	    }
	  };
	},
	
	tool_rect: function () {
	  var canvas = document.getElementById("paint");
	  var context = canvas.getContext("2d");
	  var tool = this;
	  this.started = false;
	
	  // This is called when you start holding down the mouse button.
	  // This starts the pencil drawing.
	  this.mousedown = function (ev) {
	      context.beginPath();
	      context.moveTo(ev._x, ev._y);
	      tool.started = true;
	  };
	
	  // This function is called every time you move the mouse. Obviously, it only 
	  // draws if the tool.started state is set to true (when you are holding down 
	  // the mouse button).
	  this.mousemove = function (ev) {
	    if (tool.started) {
	      context.lineTo(ev._x, ev._y);
	      context.stroke();
	    }
	  };
	
	  // This is called when you release the mouse button.
	  this.mouseup = function (ev) {
	    if (tool.started) {
	      tool.mousemove(ev);
	      tool.started = false;
	    }
	  };
	},
	
	eventCanvas: function(ev) {
		if (ev.layerX || ev.layerX == 0) { // Firefox
		  ev._x = ev.layerX;
		  ev._y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		  ev._x = ev.offsetX;
		  ev._y = ev.offsetY;
		}
	      
		// Call the event handler of the tool.
		var func = tool[ev.type];
		if (func) {
		  func(ev);
		}
	},
    
  drawRect: function(ctx, x1, y1, x2, y2, fill) {
	ctx.fillStyle=fill;
	ctx.fillRect(x1, y1, x2, y2);
  },
	
  insideRect: function(x1, y1, x2, y2) {
	event = event || window.event;

	var canvas = document.getElementById('paint'),
	x = event.pageX - canvas.offsetLeft,
	y = event.pageY - canvas.offsetTop;
	
	if (x >= x1 && x <= x2 && y>=y1 && y<=y2)
		return true;
	else
		return false;
  },
	
}

var count=0;
var x1=0;
var y1=0;
var x2=0;
var y2=0;
//var ctx = document.getElementById("paint").getContext("2d");

function q(event) {
    var canvas = document.getElementById('paint');
    event = event || window.event;

        x = event.pageX - canvas.offsetLeft;
        y = event.pageY - canvas.offsetTop;

    //alert(x + ' ' + y); alert(Canvas.insideRect(100,100,200,250));
    //click to select x1,y1 and x2,y2. third click paint the rect and clear memory;
    /*count++;
    if (count===1) {
	x1=x;
	y1=y;
    } else if (count===2) {
	x2=x;
	y2=y;
    } else {
	Canvas.drawRect(canvas.getContext("2d"), x1, y1, x2, y2, "FF00FF");
	console.log("drawing at :" + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2);
	x1=0;
	y1=0;
	x2=0;
	y2=0;
	count=0;
    }
    console.log("x and y :" + x + ' ' + y);
    console.log(count);
    
    if (Canvas.insideRect(100,100,200,250)) {
	count=0;
	
	Canvas.drawRect(canvas.getContext("2d"), 0, 0, window.innerWidth, window.innerHeight, "FFFFFF");
    }*/
}