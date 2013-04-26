var canvas, canvas0, ctx0;
var ctx;
var tool = false;
var tool_default = 'rect';
var line_color, line_width;

function init() {
    var tool_select = document.getElementById("dtool");
    var clear_page = document.getElementById('clearpage');
    line_color = document.getElementById('color');
    line_width = document.getElementById('linewidth');
    
    if (!line_color) {
        alert('No line color selected!');
        return;
    }
    
    if (!line_width) {
        alert('No line width selected!');
        return;
    }
    
    if (!tool_select) {
        alert('failed to get tool selected!');
        return;
    }
    //find the canvas element
    canvas0 = document.getElementById('paint');
    if (!canvas0) {
        alert("Error: Could not find canvas element!");
        return;
    }
    if (!canvas0.getContext) {
        alert('Error: no canvas.getContext!');
        return;
    }
    
    //get the 2D canvas context
    ctx0 = canvas0.getContext('2d');
    if (!ctx0) {
        alert('Error: failet to get Context!');
        return;
    }
    ctx0.canvas.width  = window.innerWidth;
    ctx0.canvas.height = window.innerHeight;

    //temp canvas
    var container = canvas0.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
        alert('Error: I cannot create a new canvas element!');
        return;
    }
    
    canvas.id = 'canvasTemp';
    canvas.width = canvas0.width;
    canvas.height = canvas0.height;
    container.appendChild (canvas);
    
    ctx = canvas.getContext('2d');
    
    //event listeners for each changing variables
    clear_page.addEventListener('mousedown', eventClearPage, false);
    tool_select.addEventListener('change', eventToolChange, false);
    canvas0.addEventListener('mousedown', eventCanvas, false);
    canvas0.addEventListener('mousemove', eventCanvas, false);
    canvas0.addEventListener('mouseup', eventCanvas, false);

    if (tools[tool_default]) {
        tool = new tools[tool_default]();
        tool_select.value = tool_default;
    }
    
}

function eventClearPage(ev) {
    ctx0.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function eventToolChange(ev) {
    if (tools[this.value]) {
        tool = new tools[this.value]();
        console.log(this.value);
    }
}

//draws #canvasTemp canvas on top of #paint,
//after which #canvasTemp is cleared. Called
//everytime user completes a drawing operation.
function img_update() {
    ctx0.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var tools = {};

tools.pencil = function () {
    var tool = this;
    tool.started = false;
    
    this.mousedown = function (ev) {
      ctx.beginPath();
      ctx.moveTo(ev._x,ev._y);
      tool.started = true;
    };
    
    this.mouseup = function(ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
    this.mousemove = function(ev) {
        if (tool.started) {
           ctx.strokeStyle = line_color.value;
           ctx.lineWidth = line_width.value;
           ctx.lineTo(ev._x,ev._y);
           ctx.stroke();
        }
    };
};

tools.line = function () {
    var tool = this;
    tool.started = false;
    
    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };
    
    this.mouseup = function(ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
    this.mousemove = function(ev) {
        if (!tool.started) {
            return;
        }
           ctx.clearRect(0, 0, canvas.width, canvas.height);
           
           ctx.beginPath();
           ctx.moveTo(tool.x0, tool.y0);
           ctx.lineTo(ev._x,ev._y);
           ctx.strokeStyle = line_color.value;
           ctx.lineWidth = line_width.value;
           ctx.stroke();
           ctx.closePath();
    };
};


tools.rect = function () {
    var tool = this;
    tool.started = false;
    
    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };
    
    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }
        
        var x = Math.min(ev._x, tool.x0),
            y = Math.min(ev._y, tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0);
            
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!w || !h) {
            return;
        }
        
        ctx.strokeStyle = line_color.value;
        ctx.lineWidth = line_width.value;
        ctx.strokeRect(x, y, w, h);
    };
    
    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

tools.circle = function () {
    var tool = this;
    tool.started = false;
    
    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };
    
    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }
        
        var r = Math.sqrt(Math.pow((tool.x0-ev._x),2)+Math.pow((tool.y0-ev._y),2)),
            start = 0;
            stop = 2*Math.PI;
            
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!r) {
            return;
        }
        
        ctx.strokeStyle = line_color.value;
        ctx.lineWidth = line_width.value;
        ctx.beginPath();
        ctx.arc(tool.x0, tool.y0, r, start, stop);
        ctx.stroke();
        ctx.closePath();
    };
    
    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};


function eventCanvas(ev) {
    if (ev.layerX || ev.layerY == 0) {//Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetY == 0) {//Opera
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
    }
    
    var func = tool[ev.type];
    if (func) {
        func(ev);
    }
}