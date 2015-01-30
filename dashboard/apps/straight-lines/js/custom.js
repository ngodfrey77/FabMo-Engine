var c = null;

//On Load Init
$(document).ready(function(){
	//Get settings or set default settings
	c = new Canvas();
});




/********** Function for "Canvas" object = all the "Grid" section **********/
Canvas = function(){
	this.grid = [];
	//this.tasks = [];

	//Assignation of paper to the window, size of the project
	this.init();

	//Load Settings of project into paper
	this.loadSettings();

	//
};

Canvas.prototype.init = function(){
	//Init Canvas
	$("#project_content").addClass("active"); //Resolve screen dimensions problem
	paper.install(window);
	paper.setup('myCanvas');
	this.resize();
	$("#project_content").removeClass("active"); //Resolve screen dimensions problem
};

Canvas.prototype.resize = function(){
	$("#project_content").addClass("active"); //Resolve screen dimensions problem
	paper.view.viewSize = new Size(ratio,(ratio/s.x)*s.y);
	$("#canvas-container canvas").width($("#canvas-container").width());
	$("#canvas-container canvas").height(($("#canvas-container").width()/s.x)*s.y);
	$("#canvas-container").height(($("#canvas-container").width()/s.x)*s.y);
	console.log($("#canvas-container").css( "width" ));
	console.log($("#canvas-container").css( "height" ));
	$("#project_content").removeClass("active"); //Resolve screen dimensions problem
};

Canvas.prototype.loadSettings = function(){
	if (!s){
		//In this case, there is not s object
		console.log("No Settings object, Canvas use may cause App bugs")
	}
	else {
		//Define new canvas size
		$("#project_content").addClass("active");
		this.resize();

		//Clear
		paper.project.clear(); //Not effective ?

		//Check canvas
		var sStep = 1;	var mStep = 5;	var lStep = 10;
		var stepx = s.x < 100 ? (s.x < 10 ? sStep : mStep) : lStep;
		var stepy = s.y < 100 ? (s.y < 10 ? sStep : mStep) : lStep;

		//Enter Dimensions to grid container
		$("#xScale").html('X : ' + s.x + '" ' + '(' + stepx + '"/grad)');
		$("#yScale").html('y : ' + s.y + '" ' + '(' + stepy + '"/grad)');

	    //X graduation from left
	    for (var i = stepx ; i < s.x ; i+=stepx) {
	        var topPoint = new paper.Point( this.xPos(i) , this.yPos(s.y) );
	        var bottomPoint = new paper.Point(this.xPos(i), this.yPos(0));
	        var aLine = new paper.Path.Line(topPoint, bottomPoint);
	        aLine.strokeColor = '#ddd';
	        aLine.strokeWidth = 3; //((i%10)==0) ? 6 : (((i%10)==0) ? 4 : 2);
	    	this.grid.push(aLine);
	    }
	    //Y graduation from bottom
	    for (var i = stepy ; i < s.y ; i+=stepy) {
	        var leftPoint = new paper.Point( this.xPos(0) , this.yPos(i) );
	        var rightPoint = new paper.Point( this.xPos(s.x) , this.yPos(i) );
	        var aLine = new paper.Path.Line(leftPoint, rightPoint);
	        aLine.strokeColor = '#ddd';
	        aLine.strokeWidth = 3; //((i%10)==0) ? 5 : (((i%10)==0) ? 4 : 3);
	        this.grid.push(aLine);
	    }

	    paper.view.draw(); //Setup //Activate
	    $("#project_content").removeClass("active");
	}
};

//Return xPos converted to to canvas size 	-> Will work in responsive & fixed position if the canvas is resized
Canvas.prototype.xPos = function(x){
	return ( paper.view.bounds.left + x * (paper.view.bounds.width / s.x) );
};

//Return yPos converted to to canvas size 	-> Will work in responsive & fixed position if the canvas is resized
Canvas.prototype.yPos = function(y){
	return ( paper.view.bounds.bottom - y * (paper.view.bounds.height / s.y) );
};

//Retur, thickness (strokeWidth) 			-> Will work in responsive & fixed position if the canvas is resized
Canvas.prototype.w = function(w){
	return ( w * (paper.view.bounds.height / s.y) );
}

//This king of function should be avoid : add a Task = add object (line object, square object), that will call addLine, addPoint...
/*
Canvas.prototype.addTask = function(type,task){
	if(type == 'line') { this.addLine(task); }
};
*/

// --- Line : Add / Edit / Remove --- //
Canvas.prototype.addLine = function(l){
	//Add line view
	l.canvas = new paper.Path.Line(
		new paper.Point( this.xPos(l.x0) , this.yPos(l.y0) ),
		new paper.Point( this.xPos(l.x1) , this.yPos(l.y1) )
	);
    l.canvas.strokeColor = 'rgba(77, 135, 29, 0.8)';
    l.canvas.strokeWidth = 3;

    //Add toolPath View
    l.tCanvas = new paper.Path.Line(
		new paper.Point( this.xPos(l.t_x0) , this.yPos(l.t_y0) ),
		new paper.Point( this.xPos(l.t_x1) , this.yPos(l.t_y1) )
	);
    l.tCanvas.strokeColor = 'rgba(156, 33, 12, 0.25)'//'rgba(215, 44, 44, 0.6)';
    l.tCanvas.strokeWidth = this.w(s.bit_d);
    l.tCanvas.strokeCap = 'round';
	l.tCanvas.dashArray = [l.tCanvas.strokeWidth*2, l.tCanvas.strokeWidth*3];

	paper.view.draw(); //Setup //Activate
};

Canvas.prototype.removeLine = function(l){
	l.canvas.remove();
	l.tCanvas.remove();
	paper.view.draw(); //Setup //Activate
	console.log("remove");
};


// --- Point : Add / Edit / Remove --- //
Canvas.prototype.addPoint = function(x,y,size){
	return true;
};


/********** Function for "Tasks" object = all the tasks **********/
Tasks.reset = function(){
	$.each(this, function(index,t){
		t.removeCanvas();
	});

	//Set the number of Tasks to 0
	this.length = 0;

	//Save Tasks Model
	setAppSetting("straight-lines","Tasks",this);

	//View Tasks
	this.view();
};

Tasks.addLine = function(){
	//Create a new line (task)
	var t = new line(this.length.toString()); //Assume that it's a line

	//Add this to the list of Tasks
	this.push(t);

	//Save Tasks Model
	setAppSetting("straight-lines","Tasks",this);

	//View Tasks
	this.view();

	//Synch View

};

Tasks.remove = function(id){
	//remove the task from Canvas (if canvas)
	Tasks[Tasks.pos(id)].removeCanvas();

	//Search the position of the line to remove. Then remove
	this.splice(Tasks.pos(id), 1);

	//Save Tasks Model
	setAppSetting("straight-lines","Tasks",this);

	//View Tasks
	this.view();
};

Tasks.edit = function(id){
	//Search the position of the line to edit & get this line
	var t = this[this.pos(id)];

	//Update it status to current
	t.setCurrent();

	//Load Form with properties
	t.setForm();

	//View Tasks
	this.view();
};

Tasks.save = function(id){
	//Search for the line and add it
	if(this.pos(id)){
		var t = this[this.pos(id)];
		t.getForm();

		//Remove current
		t.resetCurrent();

		//Save Tasks Model
		setAppSetting("straight-lines","Tasks",this);

		//View Tasks
		this.view();
	}

	//If line not founded, create a new one
	else {
		this.addLine();
	}
}

Tasks.view = function(){
	var str=""; //Str will be the HTML content
	$.each(this, function(index,t){
		str += t.addTaskList(); //For each Line, we add the HTML content
	});
	$(".list-lines-container").html(str); //Set this into the HTML table

	//Synch the click listener on this view
	listenClickTasks();
};

Tasks.toolpath = function(){
	$.each(this, function(i,t){
		t.toolpath();
	});
}

Tasks.pos = function(id) {
	var pos = null;
	$.each(this, function(i,t) {
		if(t.id == id) {
			pos = i;
		}
	});
	return pos;
};

//Sort Line by position : not used yet
Tasks.sort = function(){
	this.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
};




/********** Model and function of a single line **********/
line = function(l,x0,y0,x1,y1,name,side) {
	this.id="line-" + l;
	this.pos = l;
	this.canvas = null;
	this.tCanvas = null;
	name ? this.name = name : (this.name = $("#line_name").val() 	? 	$("#line_name").val() : this.id);
	this.current=0;
	this.x0 = x0 ? x0 : ($("#line_x0").length 	? 	parseFloat($("#line_x0").val())	: 0); //X start position of a line
	this.y0 = y0 ? y0 : ($("#line_y0").length 	?	parseFloat($("#line_y0").val()) : 0); //Y start position of a line
	this.x1 = x1 ? x1 : ($("#line_x1").length	?	parseFloat($("#line_x1").val()) : 0); //X end position of a line
	this.y1 = y1 ? y1 : ($("#line_y1").length	?	parseFloat($("#line_y1").val()) : 0); //Y end position of a line
	this.side = side ? side : ($("input:radio[name='line_side']:checked").length	?	parseInt($("input:radio[name='line_side']:checked").val()) : 1); //3 = center, 1 = Left, 2 = Right

	this.toolpath();

	//Synch Canvas
	this.addCanvas();

	//Reset the value of "name" input & unique id "cid" -> By Security
	$("#line_name").val("");
	$("#line_name").data("cid","");
};

line.prototype.update = function(x0,y0,x1,y1,name,side) {
	//First delete view
	this.removeCanvas();

	this.x0=x0; //X start position of a line
	this.y0=y0; //Y start position of a line
	this.x1=x1; //X end position of a line
	this.y1=y1; //Y end position of a line
	this.side = side ? side : 1; //3 = center, 1 = Left, 2 = Right
	
	if(name) this.name=name;
	//else name = "Line" + pos;

	this.toolpath();

	//Synch Canvas
	this.addCanvas();
};

line.prototype.setCurrent = function() { this.current=1 };
line.prototype.resetCurrent = function() { this.current=0 };

line.prototype.getForm = function(){
	//Add attributes
	this.update(
		$("#line_x0").length 	? 	parseFloat($("#line_x0").val())	: null,
		$("#line_y0").length 	?	parseFloat($("#line_y0").val()) : null,
		$("#line_x1").length	?	parseFloat($("#line_x1").val()) : null,
		$("#line_y1").length	?	parseFloat($("#line_y1").val()) : null,
		this.name = $("#line_name").val() 	? 	$("#line_name").val() : this.id,
		$("input:radio[name='line_side']:checked").length	?	parseInt($("input:radio[name='line_side']:checked").val()) : null
	);

	//Reset the value of "name" input & unique id "cid"
	$("#line_name").val("");
	$("#line_name").data("cid","");
};

line.prototype.setForm = function(){
	if ($("#line_name").length)	{ $("#line_name").val(this.name); }
	if ($("#line_name").length)	{ $("#line_name").data("cid",this.id); }
	if ($("#line_x0").length) 	{ $("#line_x0").val(this.x0.toString()); }
	if ($("#line_y0").length) 	{ $("#line_y0").val(this.y0.toString()); }
	if ($("#line_x1").length) 	{ $("#line_x1").val(this.x1.toString()); }
	if ($("#line_y1").length) 	{ $("#line_y1").val(this.y1.toString()); }
	if ($("input:radio[name='line_side']:checked").length)	{ $("input:radio[name='line_side'][value='"+ this.side +"']").attr("checked",true); }
};

line.prototype.toolpath = function() {
	var alpha=0;

	var x0 = this.x0; 		var x1 = this.x1; 		var y0 = this.y0; 		var y1 = this.y1;
	this.t_x0 = this.x0;	this.t_x1 = this.x1;	this.t_y0 = this.y0;	this.t_y1 = this.y1;

	if(this.side != 3) {
		if ( (y1!=y0) && (x1!=x0) ) {
			alpha = Math.atan((y1-y0)/(x1-x0));
		}
		else {
			if(y1 == y0) {
				if((x1-x0)>0) 	{ alpha=0; }
				else 			{ alpha=pi; }
			}
			else if(x1 == x0) {
				if((y1-y0)>0) 	{ alpha=pi/2; }
				else 			{ alpha=3*pi/2; }
			}
		}

		if(this.side == 1) { alpha = pi/2 + alpha; } //Left
		else { alpha = 3*pi/2 + alpha; } //Right

		this.t_x0 += (s.bit_d/2) * Math.cos(alpha);
		this.t_x1 += (s.bit_d/2) * Math.cos(alpha);
		this.t_y0 += (s.bit_d/2) * Math.sin(alpha);
		this.t_y1 += (s.bit_d/2) * Math.sin(alpha);
	}
};

line.prototype.addTaskList = function() {
	var str = "";
	str += "<tr class='" + (this.current ? 'current' : '') + "' id='" + this.id + "'>";
	str += "<td>" + this.name + "</td>";
	str += "<td>(" + this.x0.toString() + "," + this.y0.toString() + ") - (" + this.x1.toString() + "," + this.y1.toString() + ")</td>";
	str += "<td class='edit'><span>E</span></td>";
	str += "<td class='delete'><span>D</span></td>";
	str += "</tr>";
	return str;
};

line.prototype.viewToolPath = function() {
	//Read the x0... y1 of the line and trace a red / Blue line
	//Read the toolPath of the line and trace a grey shadow
	return true;
};

line.prototype.removeCanvas = function(){
	if(c && this.canvas){
		c.removeLine(this);
	}
};

line.prototype.addCanvas = function(){
	if(c){
		c.addLine(this);
	}
};




/********** Real Custom Functions **********/
invertForm = function(){
	var x0 = $("#line_x0").val();
	var y0 = $("#line_y0").val();
	$("#line_x0").val($("#line_x1").val());
	$("#line_y0").val($("#line_y1").val());
	$("#line_x1").val(x0);
	$("#line_y1").val(y0);
};