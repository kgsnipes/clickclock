// redo clickclock.js

var clickclock=function(){};

clickclock.prototype.mainDialLayer=undefined;
clickclock.prototype.secondsDialLayer=undefined;
clickclock.prototype.timeDisplayLayer=undefined;
clickclock.prototype.hourDialLayer=undefined;
clickclock.prototype.minuteDialLayer=undefined;
clickclock.prototype.monthDisplayLayer=undefined;
clickclock.prototype.openweather_api_key='378b2adcd3b1d3c2c4256c6c1c1d2677';
clickclock.prototype.openweather_api_url="http://api.openweathermap.org/data/2.5/weather";

clickclock.prototype.currentTime=undefined;
clickclock.prototype.currentDay=undefined;

clickclock.prototype.clock_circle=undefined;
clickclock.prototype.clock_circle_seconds=undefined;
clickclock.prototype.clock_circle_hours=undefined;
clickclock.prototype.time_label=undefined;
clickclock.prototype.date_label=undefined;
clickclock.prototype.weather_label=undefined;

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
clickclock.prototype.date_label_color='#8f8f8f';
clickclock.prototype.is24HourWatch=false;

clickclock.prototype.clock_seconds_flip=false;
clickclock.prototype.seconds_count=1;
clickclock.prototype.months=['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];
clickclock.prototype.currentTemperature=undefined;
clickclock.prototype.currentTempUnit='C';

clickclock.prototype.init=function(ele,time){
	self=this;
	this.currentTime=time;
	this.currentDay=time;
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

clickclock.prototype.updateWeatherInformation=function(){
	
	this.getGeoLocationFromBrowser();
};

clickclock.prototype.getGeoLocationFromBrowser=function(){
	self=this;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position)
{
   
   
   	self.getWeatherInformation(position.coords.latitude,position.coords.longitude);
  
	
}, function(){});
	} 
	
};


clickclock.prototype.setUpdatedWeather=function(weather)
{
   
   if(weather!=undefined && weather.main!=undefined && weather.main.temp!=undefined)
   {
   	  this.currentTemperature=weather.main.temp;
   	  this.weather_label.content='Today : '+this.currentTemperature.toFixed(2).toString()+' '+this.getCurrentTempUnit();
  	  this.weather_label.view.draw();
   }
  
	
};

clickclock.prototype.getCurrentTempUnit=function()
{
	return this.currentTempUnit;
};

clickclock.prototype.getWeatherInformation=function(latitude,longitude)
{
	self=this;
	if(window.jQuery)
	{
		
				$.ajax({
		    url: self.openweather_api_url,
		 
		    // The name of the callback parameter, as specified by the YQL service
		    jsonp: "callback",
		 
		    // Tell jQuery we're expecting JSONP
		    dataType: "jsonp",
		 
		    // Tell YQL what we want and that we want JSON
		    data: {
		       APPID:self.openweather_api_key, 
		       lat:latitude.toString(),
		       lon:longitude.toString(),
		       units:'metric'
		    },
		 
		    // Work with the response
		    success: function( response ) {
		    	self.setUpdatedWeather(response);
		        
		    }
		});
	}
  	
};

clickclock.prototype.setWeatherLabel=function(){
		self=this;
		this.weather_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.15),this.clock_radius+(this.clock_radius*0.15)));
		this.weather_label.fontFamily='Roboto';
		this.weather_label.fontSize=this.clock_radius*0.10;
		this.weather_label.fontWeight='bold';
		this.weather_label.fillColor=this.date_label_color;
		this.weather_label.content='';
		this.monthDisplayLayer.addChild(this.weather_label);
		this.weather_label.view.draw();
		this.weather_label.onMouseUp=function(event)
		{
			if(self.currentTempUnit=='C')
			{
				self.currentTempUnit='F';
				self.currentTemperature= (self.currentTemperature * (9/5)) + 32;
			}
			else
			{
				self.currentTempUnit='C';
				self.currentTemperature= (self.currentTemperature - 32) * (5/9);
			}

			self.weather_label.content='Today : '+self.currentTemperature.toFixed(2).toString()+' '+self.getCurrentTempUnit();
  	  		self.weather_label.view.draw();

		};

		this.updateWeatherInformation();
	
};



clickclock.prototype.addComponentsToLayers=function(){
	
	this.setMainDial();
	this.setUpdatedSeconds();
	this.setTimeDisplay();
	this.setMonthInfo();
	this.setWeatherLabel();
	
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
	
	this.time_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.25)-(this.clock_radius*0.30),this.clock_radius+(this.clock_radius*0.55)));

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

clickclock.prototype.setMonthInfo=function(){
	
	
	this.date_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.25),this.clock_radius+(this.clock_radius*1)));
	this.date_label.fontFamily='Roboto';
	this.date_label.fontSize=this.clock_radius*0.30;
	this.date_label.fontWeight='bold';
	this.date_label.fillColor=this.date_label_color;
	this.monthDisplayLayer.addChild(this.date_label);
	this.date_label.view.draw();

	this.month_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.60),this.clock_radius+(this.clock_radius*0.86)));
	this.month_label.fontFamily='Roboto';
	this.month_label.fontSize=this.clock_radius*0.10;
	this.month_label.fontWeight='bold';
	this.month_label.fillColor=this.date_label_color;
	this.monthDisplayLayer.addChild(this.month_label);
	this.month_label.view.draw();

	this.year_label=new PointText(new Point(this.clock_radius+(this.clock_radius*0.60),this.clock_radius+(this.clock_radius*1)));
	this.year_label.fontFamily='Roboto';
	this.year_label.fontSize=this.clock_radius*0.10;
	this.year_label.fontWeight='bold';
	this.year_label.fillColor=this.date_label_color;
	this.monthDisplayLayer.addChild(this.year_label);
	this.year_label.view.draw();

	this.updateMonthInfo();
	
};




clickclock.prototype.updateMonthInfo=function(){

	this.date_label.content=new Date().getDate();
	this.month_label.content=this.months[new Date().getMonth()];
	this.year_label.content=new Date().getFullYear().toString();
	
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
	this.monthDisplayLayer=new Layer();

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

		this.updateMonthInfo();
	}

	if(d.getTime()-this.currentDay.getTime()>=3600000)
	{
		this.currentDay=d;
		this.updateWeatherInformation();
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
	currentPoints.from_point=this.getXYForDegree(((-450+seconds)*0.0174532925)-radian6,(this.clock_radius-(this.clock_radius*0.25)));
	currentPoints.through_point=this.getXYForDegree(((-450+seconds)*0.0174532925),(this.clock_radius-(this.clock_radius*0.25)));
	currentPoints.to_point=this.getXYForDegree(((-450+seconds)*0.0174532925)+radian6,(this.clock_radius-(this.clock_radius*0.25)));
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