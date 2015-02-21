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
	this.clock_interval=setInterval(function(){self.updateColorFlip();self.updateDialCurrentSeconds();},1000);


};

clickclock.prototype.setCurrentTimeSeconds=function(){

		d=new Date();
		this.clock_seconds_count=d.getSeconds()*6;

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

	this.time_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.25)-(this.clock_radius*0.35),this.clock_radius+(this.clock_radius*0.55)));
	this.time_label.content='Time';
	this.time_label.fontFamily='Roboto';
	this.time_label.fontSize=this.clock_radius*0.30;
	this.time_label.fontWeight='bold';
	this.time_label.fillColor=this.time_label_font_color;
	this.time_label.view.draw();

};

clickclock.prototype.updateTimeDisplay=function(){

	d=new Date();
	this.time_label.content=((d.getHours()>9)?d.getHours():'0'+d.getHours())+":"+((d.getMinutes()>9)?d.getMinutes():'0'+d.getMinutes())+":"+((d.getSeconds()>9)?d.getSeconds():'0'+d.getSeconds());

};


clickclock.prototype.updateDialCurrentSecondsLapsed=function(){
	d=new Date();
	seconds_count=0;
	updatedPoints=undefined;
	while(seconds_count!=this.clock_seconds_count)
	{
		seconds_count=seconds_count+6;
		updatedPoints=this.calculateSecondsArc(seconds_count);
		this.drawSecondsDialWithPoints(this.calculateSecondsArc(seconds_count));
		this.updateTimeDisplay(); 
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
			
			this.clock_seconds_count=0;
			this.clock_seconds_flip=!this.clock_seconds_flip;
		}

};



clickclock.prototype.drawSecondsDialWithPoints=function(points)
{

		this.clock_circle_seconds = new Path.Arc(points.from_point,points.through_point,points.to_point);
        this.clock_circle_seconds.view.draw();
        this.clock_circle_seconds.strokeWidth = this.clock_stroke_seconds_width;  
        this.setSecondsDialColor();
        this.clock_circle_seconds.view.draw();
		
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