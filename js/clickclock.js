var clickclock=function(){};
clickclock.prototype.clock_circle=undefined;
clickclock.prototype.clock_circle_seconds=undefined;
clickclock.prototype.clock_radius=200;
clickclock.prototype.clock_stroke_width=10;
clickclock.prototype.total_degrees=360;
clickclock.prototype.clock_interval=undefined;
clickclock.prototype.clock_frame_color='#888888';
clickclock.prototype.clock_seconds_color='#89ff92';
clickclock.prototype.clock_seconds_color_invert='#ffffff';
clickclock.prototype.clock_seconds_count=0;
clickclock.prototype.clock_seconds_flip=false;
clickclock.prototype.time_label=undefined;

clickclock.prototype.init=function(){
	self=this;
	paper.install(window);
	window.onload = function() {
					paper.setup('clickclock');
					self.drawClockCircle();
					self.drawTimeText();

				};



};


clickclock.prototype.drawClockCircle=function(){
		self=this;
		this.clock_circle = new Path.Circle(new Point(this.clock_radius+(this.clock_radius*0.50),this.clock_radius+(this.clock_radius*0.50)), this.clock_radius);
		this.clock_circle.strokeColor =this.clock_frame_color ;
		this.clock_circle.strokeWidth = this.clock_stroke_width;
        this.clock_circle.view.draw();
        
        //this.xfactor=1;

       // this.from_point = new Point((this.clock_circle.bounds.x)+(this.clock_circle.bounds.width*0.5),(this.clock_circle.bounds.y-(this.clock_radius*0.10)));

		//this.to_point = new Point((this.from_point.x)+(this.from_point.x*this.xfactor),this.from_point.y+(this.from_point.y*(this.xfactor*0.5)));

		//this.through_point = new Point(this.from_point.x+((this.from_point.x*this.xfactor)*0.5),this.from_point.y+((this.from_point.y*(this.xfactor*0.25))*0.5));
		d=new Date();
		this.clock_seconds_count=d.getSeconds()*6;
		this.clock_interval=setInterval(function(){self.updateClock();},1000);

};

clickclock.prototype.drawTimeText=function(){

	this.time_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.50)-(this.clock_radius*0.25),this.clock_radius+(this.clock_radius*0.50)));
	this.time_label.content='Time';
	this.time_label.fontFamily='Roboto';
	this.time_label.fontSize=20;
};

clickclock.prototype.updateTimeText=function(){

	d=new Date();
	this.time_label.content=((d.getHours()>9)?d.getHours():'0'+d.getHours())+":"+((d.getMinutes()>9)?d.getMinutes():'0'+d.getMinutes())+":"+((d.getSeconds()>9)?d.getSeconds():'0'+d.getSeconds());
	
};


clickclock.prototype.updateClock=function(){

		
		this.clock_seconds_count=this.clock_seconds_count+6;
		this.calculateSecondsArc();
		this.updateTimeText();
		this.clock_circle_seconds = new Path.Arc(this.from_point,this.through_point,this.to_point);
		//this.clock_circle_seconds.strokeColor = this.clock_seconds_color;
		//this.clock_circle_seconds.strokeWidth = 10;
        this.clock_circle_seconds.view.draw();
        

        if(this.clock_seconds_count>=360)
		{
			this.clock_seconds_count=0;
			this.clock_seconds_flip=!this.clock_seconds_flip;
			
		}

		if(this.clock_seconds_flip)
			{
				
				this.clock_circle_seconds.strokeColor = this.clock_seconds_color_invert;
				this.clock_circle_seconds.strokeWidth = 11;

			}
			else
			{
				
				this.clock_circle_seconds.strokeColor = this.clock_seconds_color;
				this.clock_circle_seconds.strokeWidth = 10;
			}        


};

clickclock.prototype.calculateSecondsArc=function()
{

	radian6=0.0174532925*6;
	this.from_point=this.getXYForDegree(((-450+this.clock_seconds_count)*0.0174532925)-radian6,(this.clock_radius+(this.clock_radius*0.20)));
	this.through_point=this.getXYForDegree(((-450+this.clock_seconds_count)*0.0174532925),(this.clock_radius+(this.clock_radius*0.20)));
	this.to_point=this.getXYForDegree(((-450+this.clock_seconds_count)*0.0174532925)+radian6,(this.clock_radius+(this.clock_radius*0.20)));
	
		
};

clickclock.prototype.getXYForDegree=function(deg,radius)
{
	r=radius;
	t=deg;
	x=(r*Math.cos(t))+300;
	y=(r*Math.sin(t))+300;
	return new Point(x,y);
};



var clockobj=new clickclock();
clockobj.init();