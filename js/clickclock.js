// redo clickclock.js

var clickclock=function(){};

clickclock.prototype.mainDialLayer=undefined;
clickclock.prototype.secondsDialLayer=undefined;
clickclock.prototype.timeDisplayLayer=undefined;
clickclock.prototype.hourDialLayer=undefined;
clickclock.prototype.minuteDialLayer=undefined;


clickclock.prototype.currentTime=undefined;

clickclock.prototype.clock_circle=undefined;
clickclock.prototype.clock_circle_seconds=undefined;
clickclock.prototype.clock_circle_hours=undefined;
clickclock.prototype.time_label=undefined;

clickclock.prototype.clock_radius=200;
clickclock.prototype.clock_stroke_width=clickclock.prototype.clock_radius*0.20;
clickclock.prototype.clock_stroke_seconds_width=clickclock.prototype.clock_radius*0.10;
clickclock.prototype.clock_stroke_hours_width=clickclock.prototype.clock_radius*0.20;
clickclock.prototype.clock_stroke_minutes_width=clickclock.prototype.clock_radius*0.30;
clickclock.prototype.clock_frame_color='#888888';

clickclock.prototype.clock_seconds_color='#89ff92';
clickclock.prototype.clock_seconds_color_invert='#ffffff';

clickclock.prototype.time_label_font_color='#303030';
clickclock.prototype.clock_circle_fill_color='#fee98f';
clickclock.prototype.clock_hour_fill_color='#ff511e';
clickclock.prototype.clock_minute_fill_color='#ffc005';
clickclock.prototype.is24HourWatch=false;

clickclock.prototype.clock_seconds_flip=false;
clickclock.prototype.seconds_count=1;


clickclock.prototype.init=function(ele,time){
	self=this;
	this.currentTime=time;
	paper.install(window);
	paper.setup(ele);
	this.canvas=document.getElementById(ele);
	this.setCanvasDimensions();
	this.setupLayers();
	this.addComponentsToLayers();
	paper.view.onFrame=function(event)
	{
		self.updateFrame();
	};


};

clickclock.prototype.setCanvasDimensions=function(){
	
	this.canvas.width=(this.clock_radius+(this.clock_radius*0.50))*2;
	this.canvas.height=(this.clock_radius+(this.clock_radius*0.50))*2;
	
};

clickclock.prototype.addComponentsToLayers=function(){
	
	this.setMainDial();
	this.setUpdatedSeconds();
	this.setTimeDisplay();
	
};

clickclock.prototype.updateTimeDisplay=function(){

	d=this.currentTime;
	
	if(this.is24HourWatch)
	{
		this.time_label.content=((d.getHours()>9)?d.getHours():'0'+d.getHours())+":"+((d.getMinutes()>9)?d.getMinutes():'0'+d.getMinutes())+":"+((d.getSeconds()>9)?d.getSeconds():'0'+d.getSeconds());
	}
	else
	{
		hours=d.getHours()%12;
		this.time_label.content=((hours>9)?hours:'0'+hours)+":"+((d.getMinutes()>9)?d.getMinutes():'0'+d.getMinutes())+":"+((d.getSeconds()>9)?d.getSeconds():'0'+d.getSeconds())+" "+((d.getHours()>12)?"PM":"AM");
	}
		
	this.time_label.view.draw();
};

clickclock.prototype.setMainDial=function(){
	
	this.clock_circle = new Path.Circle(new Point(this.clock_radius+(this.clock_radius*0.50),this.clock_radius+(this.clock_radius*0.50)), this.clock_radius);
	this.clock_circle.strokeColor =this.clock_frame_color ;
	this.clock_circle.strokeWidth = this.clock_stroke_width;
	this.clock_circle.fillColor=this.clock_circle_fill_color;
	this.mainDialLayer.addChild(this.clock_circle);
    this.clock_circle.view.draw();

};

clickclock.prototype.setUpdatedSeconds=function(){
	
	points=this.calculateSecondsArc(this.currentTime.getSeconds()*6);
	if(this.clock_circle_seconds!=undefined)
	{
		this.clock_circle_seconds.remove();
	}
	this.clock_circle_seconds = new Path.Arc(points.from_point,points.through_point,points.to_point);	
	this.secondsDialLayer.addChild(this.clock_circle_seconds);
	this.setSecondsDialColor(); 
    this.clock_circle_seconds.view.draw();

};

clickclock.prototype.setUpdatedHours=function(){
	
	if(this.is24HourWatch)
	{
		points=this.calculateHoursArc(this.currentTime.getHours()*15);
	}
	else
	{
		points=this.calculateHoursArc(this.currentTime.getHours()*30);
	}
	
	if(this.clock_circle_hours!=undefined)
	{
		this.clock_circle_hours.remove();
	}
	this.clock_circle_hours = new Path.Arc(points.from_point,points.through_point,points.to_point);	
	this.clock_circle_hours.strokeColor = this.clock_hour_fill_color;
	this.clock_circle_hours.strokeWidth = this.clock_stroke_hours_width;
	this.secondsDialLayer.addChild(this.clock_circle_hours);
    this.clock_circle_hours.view.draw();

};


clickclock.prototype.setUpdatedMinutes=function(){
	
	points=this.calculateMinutesArc(this.currentTime.getMinutes()*6);
	
	
	if(this.clock_circle_minutes!=undefined)
	{
		this.clock_circle_minutes.remove();
	}
	this.clock_circle_minutes = new Path.Arc(points.from_point,points.through_point,points.to_point);	
	this.clock_circle_minutes.strokeColor = this.clock_minute_fill_color;
	this.clock_circle_minutes.strokeWidth = this.clock_stroke_minutes_width;
	this.secondsDialLayer.addChild(this.clock_circle_minutes);
    this.clock_circle_minutes.view.draw();

};


clickclock.prototype.setTimeDisplay=function(){
	self=this;
	
	this.time_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.25)-(this.clock_radius*0.35),this.clock_radius+(this.clock_radius*0.55)));

	this.updateTimeDisplay();

	this.time_label.fontFamily='Roboto';
	if(this.is24HourWatch)
		this.time_label.fontSize=this.clock_radius*0.30;
	else
		this.time_label.fontSize=this.clock_radius*0.20;

	this.time_label.fontWeight='bold';
	this.time_label.fillColor=this.time_label_font_color;
	this.timeDisplayLayer.addChild(this.time_label);
	this.time_label.view.draw();
	this.time_label.onMouseUp = function(event) {
    	self.changeTimeDisplay();
	}

};

clickclock.prototype.changeTimeDisplay=function(){
	this.is24HourWatch=!this.is24HourWatch;
	if(this.is24HourWatch)
		this.time_label.fontSize=this.clock_radius*0.30;
	else
		this.time_label.fontSize=this.clock_radius*0.20;

	this.updateTimeDisplay();
	
};




clickclock.prototype.setupLayers=function()
{
	this.mainDialLayer=new Layer();
	this.secondsDialLayer=new Layer();
	this.hourDialLayer=new Layer();
	this.minuteDialLayer=new Layer();
	this.timeDisplayLayer=new Layer();

};


clickclock.prototype.updateFrame=function(){
	
	d=new Date();
	if(d.getTime()-this.currentTime.getTime()>=1000)
	{
		this.currentTime=d;
		this.updateTimeDisplay();
		this.setSecondsDialColor();
		this.setUpdatedSeconds();
		this.seconds_count+=1;
		this.setUpdatedHours();
		this.setUpdatedMinutes();
	}

	if(this.seconds_count>=60 )
	{
		this.seconds_count=1;
		//this.secondsDialLayer.removeChildren(0,this.secondsDialLayer.children.length);
		this.setSecondsDialColor();

		
	}
	
};


clickclock.prototype.calculateSecondsArc=function(seconds)
{

	radian6=0.0174532925*10;
	currentPoints={};
	currentPoints.from_point=this.getXYForDegree(((-450+seconds)*0.0174532925)-radian6,(this.clock_radius+(this.clock_radius*0.20)));
	currentPoints.through_point=this.getXYForDegree(((-450+seconds)*0.0174532925),(this.clock_radius+(this.clock_radius*0.20)));
	currentPoints.to_point=this.getXYForDegree(((-450+seconds)*0.0174532925)+radian6,(this.clock_radius+(this.clock_radius*0.20)));
	return currentPoints;
		
};


clickclock.prototype.calculateHoursArc=function(seconds)
{

	radian6=0.0174532925*4;
	currentPoints={};
	currentPoints.from_point=this.getXYForDegree(((-450+seconds)*0.0174532925)-radian6,(this.clock_radius-(this.clock_radius*0.30)));
	currentPoints.through_point=this.getXYForDegree(((-450+seconds)*0.0174532925),(this.clock_radius-(this.clock_radius*0.30)));
	currentPoints.to_point=this.getXYForDegree(((-450+seconds)*0.0174532925)+radian6,(this.clock_radius-(this.clock_radius*0.30)));
	return currentPoints;
		
};

clickclock.prototype.calculateMinutesArc=function(seconds)
{

	radian6=0.0174532925*2;
	currentPoints={};
	currentPoints.from_point=this.getXYForDegree(((-450+seconds)*0.0174532925)-radian6,(this.clock_radius-(this.clock_radius*0.30)));
	currentPoints.through_point=this.getXYForDegree(((-450+seconds)*0.0174532925),(this.clock_radius-(this.clock_radius*0.30)));
	currentPoints.to_point=this.getXYForDegree(((-450+seconds)*0.0174532925)+radian6,(this.clock_radius-(this.clock_radius*0.30)));
	return currentPoints;
		
};

clickclock.prototype.getXYForDegree=function(deg,radius)
{
	r=radius;
	t=deg;
	x=(r*Math.cos(t))+this.clock_circle.position.x;
	y=(r*Math.sin(t))+this.clock_circle.position.y;
	return new Point(x,y);
};

clickclock.prototype.setSecondsDialColor=function(){

			if(this.clock_seconds_flip)
			{
				this.clock_circle_seconds.strokeColor = this.clock_seconds_color_invert;
				this.clock_circle_seconds.strokeWidth = this.clock_stroke_seconds_width+1;
			}
			else
			{
				this.clock_circle_seconds.strokeColor = this.clock_seconds_color;
				this.clock_circle_seconds.strokeWidth = this.clock_stroke_seconds_width-1;
			}   


};




var clockobj;

window.onload = function() {
					
					clockobj=new clickclock();
					clockobj.init('clickclock',new Date());
					

				};