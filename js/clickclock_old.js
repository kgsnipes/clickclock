var clickclock=function(){};
clickclock.prototype.clock_circle=undefined;
clickclock.prototype.clock_circle_seconds=undefined;
clickclock.prototype.clock_radius=200;
clickclock.prototype.clock_stroke_width=clickclock.prototype.clock_radius*0.30;
clickclock.prototype.clock_stroke_seconds_width=clickclock.prototype.clock_radius*0.05;
clickclock.prototype.total_degrees=360;
clickclock.prototype.clock_interval=undefined;
clickclock.prototype.clock_frame_color='#888888';
clickclock.prototype.clock_seconds_color='#89ff92';
clickclock.prototype.clock_seconds_color_invert='#ffffff';
clickclock.prototype.clock_seconds_count=0;
clickclock.prototype.clock_seconds_flip=false;
clickclock.prototype.time_label=undefined;
clickclock.prototype.time_label_font_color='#303030';
clickclock.prototype.clock_circle_fill_color='#fee98f';
clickclock.prototype.canvas=undefined;
clickclock.prototype.is24HourWatch=false;
clickclock.prototype.hour_minute_color='#969696';
clickclock.prototype.hour_minute_stroke_width=clickclock.prototype.clock_radius*0.10;
clickclock.prototype.clock_circle_hoursMinutes=undefined;
clickclock.prototype.date=new Date("October 13, 2014 11:40:00");
clickclock.prototype.currentFrameTime=0;

clickclock.prototype.init=function(ele){
	self=this;
	paper.install(window);
	paper.setup(ele);
	this.canvas=document.getElementById(ele);

	this.setCanvasDimensions();
	this.setCurrentTimeSeconds();
	this.setMainDial();
	this.setTimeDisplay();
	this.updateDialCurrentSecondsLapsed();
	//this.updateDialCurrentHoursMinutesLapsed();
	this.clock_interval=setInterval(function(){self.date=new Date(self.date.getTime()+1000);self.updateColorFlip();self.updateDialCurrentSeconds();},1000);
	paper.view.onFrame=function(event)
	{
		//self.updateFrame(parseInt(event.time));
	};


};

clickclock.prototype.updateFrame=function(secondsSoFar)
{
	if(this.currentFrameTime!=secondsSoFar)
	{
		this.currentFrameTime=secondsSoFar;
		self.date=new Date(self.date.getTime()+1000);
		self.updateColorFlip();
		self.updateDialCurrentSeconds();
	}
};

clickclock.prototype.setCurrentTimeSeconds=function(){

		
		this.clock_seconds_count=this.date.getSeconds()*6;

	};

clickclock.prototype.setCanvasDimensions=function(){
	
	this.canvas.width=(this.clock_radius+(this.clock_radius*0.50))*2;
	this.canvas.height=(this.clock_radius+(this.clock_radius*0.50))*2;
	
};

clickclock.prototype.setMainDial=function(){
	
	this.clock_circle = new Path.Circle(new Point(this.clock_radius+(this.clock_radius*0.50),this.clock_radius+(this.clock_radius*0.50)), this.clock_radius);
	this.clock_circle.strokeColor =this.clock_frame_color ;
	this.clock_circle.strokeWidth = this.clock_stroke_width;
	this.clock_circle.fillColor=this.clock_circle_fill_color;
    this.clock_circle.view.draw();
};



clickclock.prototype.setTimeDisplay=function(){
	self=this;
	curtime=undefined;
	if(this.time_label!=undefined)
	{
		curtime=this.time_label.content;
	}
	this.time_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.25)-(this.clock_radius*0.35),this.clock_radius+(this.clock_radius*0.55)));
	this.time_label.content=(curtime!=undefined)?curtime:"";
	this.time_label.fontFamily='Roboto';
	if(this.is24HourWatch)
		this.time_label.fontSize=this.clock_radius*0.30;
	else
		this.time_label.fontSize=this.clock_radius*0.20;

	this.time_label.fontWeight='bold';
	this.time_label.fillColor=this.time_label_font_color;
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

clickclock.prototype.updateTimeDisplay=function(){

	d=this.date;
	
	if(this.is24HourWatch)
	{
		this.time_label.content=((d.getHours()>9)?d.getHours():'0'+d.getHours())+":"+((d.getMinutes()>9)?d.getMinutes():'0'+d.getMinutes())+":"+((d.getSeconds()>9)?d.getSeconds():'0'+d.getSeconds());
	}
	else
	{
		hours=d.getHours()%12;
		this.time_label.content=((hours>9)?hours:'0'+hours)+":"+((d.getMinutes()>9)?d.getMinutes():'0'+d.getMinutes())+":"+((d.getSeconds()>9)?d.getSeconds():'0'+d.getSeconds())+" "+((d.getHours()>12)?"PM":"AM");
	}
		

};

clickclock.prototype.updateDialCurrentHoursMinutesLapsed=function(){

	d=this.date;
	degreeHours=d.getHours()*15;
	degreeMinutes=d.getMinutes()*6;
	if(degreeHours<degreeMinutes)
	{
		startDegree=degreeHours;
		endDegree=degreeMinutes;
	}
	else
	{
		startDegree=degreeMinutes;
		endDegree=degreeHours;
	}

	console.log(startDegree,endDegree);
	while(startDegree!=endDegree)
	{
		updatedPoints=this.calculateHoursMinutesArc(startDegree);
		this.drawHoursMinutesDialWithPoints(updatedPoints);
		startDegree=startDegree+1;
	}
	


};


clickclock.prototype.updateDialCurrentSecondsLapsed=function(){
	seconds_count=0;
	updatedPoints=undefined;
	if(this.clock_seconds_count==0)
	{
		this.clock_seconds_count+=6;
		updatedPoints=this.calculateSecondsArc(6);
	}
	else
	{
		while(seconds_count!=this.clock_seconds_count)
		{
			updatedPoints=this.calculateSecondsArc(seconds_count);
			this.drawSecondsDialWithPoints(updatedPoints);
			this.updateTimeDisplay(); 
			seconds_count=seconds_count+6;
		}
	}
	
	this.from_point=updatedPoints.from_point;
	this.through_point=updatedPoints.through_point;
	this.to_point=updatedPoints.to_point;

};


clickclock.prototype.updateDialCurrentSeconds=function(){
	
	updatedPoints=undefined;
	
	updatedPoints=this.calculateSecondsArc(this.clock_seconds_count);
	this.drawSecondsDialWithPoints(this.calculateSecondsArc(this.clock_seconds_count));
	this.updateTimeDisplay(); 

	this.clock_seconds_count=this.clock_seconds_count+6;
	
	this.from_point=updatedPoints.from_point;
	this.through_point=updatedPoints.through_point;
	this.to_point=updatedPoints.to_point;
};

clickclock.prototype.updateColorFlip=function()
{

	if(this.clock_seconds_count>=360)
		{
			
			this.clock_seconds_count=6;
			this.clock_seconds_flip=!this.clock_seconds_flip;
			this.setMainDial();
			this.setTimeDisplay();
			//this.updateDialCurrentHoursMinutesLapsed();
		}

};



clickclock.prototype.drawSecondsDialWithPoints=function(points)
{

		this.clock_circle_seconds = new Path.Arc(points.from_point,points.through_point,points.to_point);
        this.clock_circle_seconds.strokeWidth = this.clock_stroke_seconds_width;  
        this.setSecondsDialColor();
        this.clock_circle_seconds.view.draw();
		
};


clickclock.prototype.drawHoursMinutesDialWithPoints=function(points)
{

		this.clock_circle_hoursMinutes = new Path.Arc(points.from_point,points.through_point,points.to_point);
        this.clock_circle_hoursMinutes.view.draw();
        this.clock_circle_hoursMinutes.strokeColor = this.hour_minute_color; 
        this.clock_circle_hoursMinutes.strokeWidth=this.hour_minute_stroke_width; 

		
};

clickclock.prototype.calculateSecondsArc=function(seconds)
{

	radian6=0.0174532925*6;
	currentPoints={};
	currentPoints.from_point=this.getXYForDegree(((-450+seconds)*0.0174532925)-radian6,(this.clock_radius+(this.clock_radius*0.20)));
	currentPoints.through_point=this.getXYForDegree(((-450+seconds)*0.0174532925),(this.clock_radius+(this.clock_radius*0.20)));
	currentPoints.to_point=this.getXYForDegree(((-450+seconds)*0.0174532925)+radian6,(this.clock_radius+(this.clock_radius*0.20)));
	return currentPoints;
		
};


clickclock.prototype.calculateHoursMinutesArc=function(seconds)
{

	radian6=0.0174532925*6;
	currentPoints={};
	currentPoints.from_point=this.getXYForDegree(((-450+seconds)*0.0174532925)-radian6,(this.clock_radius-(this.clock_radius*0.10)));
	currentPoints.through_point=this.getXYForDegree(((-450+seconds)*0.0174532925),(this.clock_radius-(this.clock_radius*0.10)));
	currentPoints.to_point=this.getXYForDegree(((-450+seconds)*0.0174532925)+radian6,(this.clock_radius-(this.clock_radius*0.10)));
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
			}   


};





var clockobj;

window.onload = function() {
					
					clockobj=new clickclock();
					clockobj.init('clickclock');
					

				};