<?php 
if ($_POST['city'])
{
	$street = str_replace(' ', '+', $_POST['street']);
	$city = str_replace(' ', '+', $_POST['city']);
	$state = str_replace(' ', '+', $_POST['state']);

	$link = "https://maps.googleapis.com/maps/api/geocode/xml?address=" . $street . ",+" . $city . ",+" . $state . "&key=AIzaSyCw3TBGXKX4NYvK-w1aVUpYQhn1HPdfAMU";
	$xmlresponse = simplexml_load_file($link);

	//check for error in result
	$status = (string) $xmlresponse->status;
	if ($status != "OK")
	{
		echo "ERROR";
		return;
	}

	$lat = (string) $xmlresponse->result->geometry->location->lat;
	$long = (string) $xmlresponse->result->geometry->location->lng;
	echo $lat . " " . $long;
}
elseif ($_POST['latitude'])
{
	$latitude = $_POST['latitude'];
	$longitude = $_POST['longitude'];

	$key = "03323b7f89bfa50d0d0f86b39f268d37";

	$link = "https://api.forecast.io/forecast/" . $key . "/" . $latitude . "," . $longitude . "?exclude=minutely,hourly,alerts,flags";

	$jsonresponse = file_get_contents($link);
	echo $jsonresponse;
}
elseif ($_POST['d_time'])
{
	$latitude = $_POST['d_latitude'];
	$longitude = $_POST['d_longitude'];
	$time = $_POST['d_time'];
	$key = "03323b7f89bfa50d0d0f86b39f268d37";
	$link = "https://api.darksky.net/forecast/" . $key . "/" . $latitude . "," . $longitude . "," . $time . "?excl
ude=minutely";
	$jsonresponse = file_get_contents($link);
	echo $jsonresponse;
}
else { ?>


<!DOCTYPE html>
<html>
<head>
	<title>Weather Search</title>
	<style>

		td,th
		{
			padding-left:7px;
			padding-right: 7px;
		}

		a
		{
			text-decoration: none;
			color: white; 
		}
		body
		{
			color:white;
			font-family: serif;
		}

		#WeatherSearch {
			height:260px;
			width: 800px;
			margin-left: auto;
			margin-right: auto;
			margin-top: 30px;
			border-radius: 10px;
			background-color: rgb(1, 165, 33);
		}
		#title
		{
			text-align: center;
			
			font-size: 50px;
			font-style: italic;
			margin-top:0px;
			margin-bottom: 0px;
		}

		#address
		{
			width: 330px;
			height:180px;
			float: left;
			position:relative ;
			margin-left:50px;
		}

		#currlocation
		{
			width:220px;
			float: right;
		}

		#searchbuttons
		{
			position:absolute;
			right: 0px;
			bottom:0px;
		}

		hr 
		{
			float:left;
			margin-left: 60px;
			color: white;
			width:3px;
			height: 125px;
			background: white;
			border: none;
			margin-top: 0px;
		}

		input
		{
			margin: 4px;
		}

		select
		{
			margin: 4px;
		}

		#state
		{
			width: 200px;
		}

		#error
		{
			width:315px;
			border-style: solid;
			border-width:2px;
			margin: auto;
			margin-top: 25px;
			border-color: rgb(158,158,158);
			text-align: center;
			background-color: rgb(239,239,239);
			display: none;
			color:black;
		}

		#currentCard
		{
			width: 402px;
			height: 285px;
			background-color:rgb(31,191,244);
			margin: auto;
			margin-top: 20px;
			border-radius: 10px;
			display: none;
		}

		.currDivs
		{
			width:67px;
			float:left;
			text-align: center;
		}

		.currIcons
		{
			width:40px;
		}

		table, th, td
		{
			border: 2px solid rgb(60,141,168);
			border-collapse: collapse;
		}

		#wTable
		{
			background-color: rgb(122,172,207);
			margin: auto;
			margin-top: 20px;
		}

		.statusIcon
		{
			width:30px;
		}

		#dayContainer
		{
			text-align: center;
			display:none;
		}

		#daycard
		{
			width: 550px;
			height: 550px;
			background-color: rgb(149,204,211);
			margin:auto;
			border-radius: 10px;
			position:relative;
		}

		#chart
		{
			color:black;
			display:none;
			margin:auto;
			width:700px;
		}

		#up_left
		{
			width: 275px;
			height:275px;
			float:left;
			text-align:left;
		}

		#up_right
		{
			width: 275px;
			height:275px;
			float:left;
			position:absolute;
			left:275px;
			top:0px;
		}

		#bottom
		{
			width: 370px;
			height:240px;
			position:absolute;
			top:300px;
			left:170px;
			text-align: left;
		}

		#day_summary
		{
			font-size:30px;
			margin-top:80px;
			margin-left:20px;
		}

		.day_category
		{
			height:35px;line-height:35px;float:left;font-size:22px;width:150px;text-align:right;
		}

		.day_val
		{
			height:35px;line-height:35px;float:left;font-size:35px;padding-left:5px
		}

		.day_sub
		{
			padding-top:13px;float:left;padding-left:3px
		}

		.day_wrap
		{
			height:35px;
		}

	</style>
</head>
<body>
	<div id = "WeatherSearch">
		<p id = "title">Weather Search</p>
		
		<form method = "POST" action = "index.php" id = "addressform">
			<div id = "address">
				<span style= "display:inline-block; width: 40px">Street</span><input id = "street" type = "text" name = "street" class = "wDisable"><br>
				<span style= "display:inline-block; width: 40px">City</span><input id = "city" type = "text" name = "city" class = "wDisable"><br>
				State <select id ="state" name = "state"></select>
				<div id = "searchbuttons">
					<input type = "button" id = "search" onclick = "searchLoc()" value = "Search">
					<input type = "button" id = "clear"  onclick = "clearResults()" value = "Clear">
				</div>
			</div>
			<hr>
			<div id = "currlocation">
				<input id = "currLocation" type = "checkbox" name = "currentlocation" onclick = "currentLocation()" autocomplete="off">Current Location
			</div>
		</form>
	</div>

	<!--div for errors-->
	<div id = "error">Please check the input address.</div>

	<div id = "currentCard">
		<p id= "inputCity" style = "font-size:30px;padding-left:20px;padding-top:20px;margin:0px"></p>
		<p id= "timezone" style = "font-size:15px;padding-left:20px;padding-top:0px;margin:0px"></p>
		
		<div id = "temp_container_2" style = "margin-left:20px;height:80px;width:400px;margin-top: 10px;margin-bottom:10px">
		<div id = "temp_val_2" style = "float:left;height:80px">
		<div id = "temperature" style = "font-size:80px;"></div>
		</div>
		<div style = "float:left;height:50px">
		<div style = "height:25px;"><img src = "https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png" style = "width:10px"></div>
		<div style = "height:50px;font-size:70px">
		<div style = "margin-left: 20px; margin-top:2px;font-size:50px">F</div>	
		</div>
		</div>
		</div>

		<p id= "summary" style = "font-size:25px;padding-left:20px;padding-bottom:10px;margin:0px"></p>

		<div id = "humidity" class = "currDivs">
		<img src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png" class = "currIcons" title = "Humidity"><br>
		<span id = "humidity_t"></span>
		</div>

		<div id = "pressure" class = "currDivs">
		<img src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png" class = "currIcons" title = "Pressure"><br>
		<span id = "pressure_t"></span>
		</div>

		<div id = "windspeed" class = "currDivs">
		<img src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png" class = "currIcons" title = "WindSpeed"><br>
		<span id = "windspeed_t"></span>
		</div>

		<div id = "visibility" class = "currDivs">
		<img src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png" class = "currIcons" title = "Visibility"><br>
		<span id = "visibility_t"></span>
		</div>

		<div id = "cloudcover" class = "currDivs">
		<img src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png" class = "currIcons" title = "CloudCover"><br>
		<span id = "cloudcover_t"></span>
		</div>

		<div id = "ozone" class = "currDivs">
		<img src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png" class = "currIcons" title="Ozone"><br>
		<span id = "ozone_t"></span>
		</div>



	</div>
	

	<!--table for days-->
	<div id = "tableCont">
	<table id = "wTable">
	</table>
	</div>


	<div id = "dayContainer">
	<p style = "color:black; font-size:30px; font-weight:bold;">Daily Weather Detail</p>

	<!--day card-->
	<div id = "daycard">

	<div id = "up_left">
	<p id = "day_summary"></p>
	<div id = "temp_container" style = "margin-left:20px;height:120px;width:250px;position:absolute">
	<div id = "temp_val" style = "float:left;height:120px">
	<div id = "inner_temp" style = "font-size:160px;margin-top:-20px"></div>
	</div>
	<div style = "float:left;height:120px">
	<div style = "height:33px;"><img src = "https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png" style = "width:10px"></div>
	<div style = "height:90px;font-size:70px">
	<div style = "margin-left: 20px; margin-top:0px;font-size:100px">F</div>	
	</div>
	</div>
	</div>
	</div>

	<div id = "up_right">
	<img id = "day_image" style = "width: 250px">
	</div>	
	<div id = "bottom">	

	<div class = "day_wrap">
	<div class = "day_category">
	Precipication:
	</div>
	<div class = "day_val" id = "day_precip_id">
	</div>
	</div>

	<div class = "day_wrap">
	<div class = "day_category">
	Chance of Rain:
	</div>
	<div class = "day_val" id = "day_rain_id">
	</div>
	<div class = "day_sub">
	%
	</div>
	</div>

	<div class = "day_wrap">
	<div class = "day_category">
	Wind Speed:
	</div>
	<div class = "day_val" id= "day_wspeed_id">
	</div>
	<div class = "day_sub">
	mph
	</div>
	</div>

	<div class = "day_wrap">
	<div class = "day_category">
	Humidity:
	</div>
	<div class = "day_val" id= "day_humid_id">
	</div>
	<div class = "day_sub" >
	%
	</div>
	</div>

	<div class = "day_wrap">
	<div class = "day_category">
	Visibility:
	</div>
	<div class = "day_val" id = "day_visibility_id">
	</div>
	<div class = "day_sub">
	mi
	</div>
	</div>

	<div class = "day_wrap">
	<div class = "day_category">
	Sunrise / Sunset:
	</div>
	<div class = "day_val" id = "day_sunrise_id">
	
	</div>
	<div class = "day_sub" id = "day_sunrise_sub_id">
	</div>
	<div class = "day_val" id = "day_sunset_id">
	
	</div>
	<div class = "day_sub" id = "day_sunset_sub_id">
	</div>
	</div>



	</div>	
	</div>

	<p style = "color:black; font-size:30px; font-weight:bold;">Day's Hourly Weather</p>
	<div id = "arrow" syle = "text-align:center;">
		<a href = "javascript:showHideChart();"><img id = "arrow_im" src = "https://cdn4.iconfinder.com/data/icons/geosm-e-commerce/18/point-down-512.png" style = "width:25px"></a>
	</div>
	<div id = "chart">
	</div>
	</div>

	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<script>
		google.charts.load('current', {'packages':['corechart']});
      	google.charts.setOnLoadCallback(drawChart);
		window.onload = populateStates;
		var gLat;
		var gLong;

		var pLat;
		var pLong;

		var weatherJSON;
		var dayJSON;
		var inputCity;

		//time offset
		var UTCoffset;
		var unixOffset;
		
		//show or hide the chart
		function showHideChart()
		{
			//show
			if (document.getElementById('chart').style.display != "block")
			{
				document.getElementById('chart').style.display = "block";
				document.getElementById('arrow_im').src = "https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ExpandLess-512.png";

			}

			//hide
			else
			{
				document.getElementById('chart').style.display = "none";
				document.getElementById('arrow_im').src = "https://cdn4.iconfinder.com/data/icons/geosm-e-commerce/18/point-down-512.png";
			}
		}


		//when search button is clicked
		function searchLoc()
		{
			//first figure out if current location is checked. if not, we need to error check and call PHP script to get coordinates
			if (document.getElementById("currLocation").checked == false)
			{
				var selector = document.getElementById("state");
				var state = selector.options[selector.selectedIndex].value;
				var street = document.getElementById("street").value;
				var city = document.getElementById("city").value;

				if(state == "state" || street == "" || city == "")
				{
					clearResults();
					document.getElementById("error").style.display = "block";
					return;
				}

				//call function to make php fetch lat/long
				getLatLong(state, street, city);
				//set city from input
				inputCity = city;

            }
            else
            {
            	getWeatherData(gLat,gLong);
            }
            document.getElementById("error").style.display = "none";
		}

		//display day info
		function displayDay()
		{
			//place into vars
			var day_summary = dayJSON.currently.summary;
			var day_temp = Math.round(dayJSON.currently.temperature);
			var icon = dayJSON.currently.icon;
			var day_icon_str;
			if (icon == "clear-day" || icon =="clear-night")
				{
					day_icon_str = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
				}
				else if (icon == "rain")
				{
					day_icon_str = "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
				}
				else if (icon == "snow")
				{
					day_icon_str = "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
				}
				else if (icon == "sleet")
				{
					day_icon_str = "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
				}
				else if (icon == "wind")
				{
					day_icon_str = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
				}
				else if (icon == "fog")
				{
					day_icon_str = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
				}
				else if (icon == "cloudy")
				{
					day_icon_str = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
				}
				else if (icon == "partly-cloudy-day" || icon == "partly-cloudy-night")
				{
					day_icon_str = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
				}

			var JSON_precip = dayJSON.currently.precipIntensity;
			var day_precipitation;
			if (!JSON_precip && JSON_precip != 0)
			{
				day_precipitation = "N/A";
			}
			else if (JSON_precip <= .001)
			{
				day_precipitation = "None";
			}
			else if (JSON_precip <= .005)
			{
				day_precipitation = "Very Light";
			}
			else if (JSON_precip <= .05)
			{
				day_precipitation = "Light";
			}
			else if (JSON_precip <= .1)
			{
				day_precipitation = "Moderate";
			}
			else 
			{
				day_precipitation = "Heavy";
			}

			var day_chancerain
			if (dayJSON.currently.precipProbability || dayJSON.currently.precipProbability == 0)
			{
				day_chancerain = Math.round((dayJSON.currently.precipProbability)*100);
			}
			else
			{
				day_chancerain = "N/A";
			}

			var day_windspeed;
			if (dayJSON.currently.windSpeed || dayJSON.currently.windSpeed == 0)
			{
				day_windspeed = dayJSON.currently.windSpeed;
			}
			else
			{
				day_windspeed = "N/A";
			}

			var day_humidity;
			if(dayJSON.currently.humidity || dayJSON.currently.humidity == 0)
			{
				day_humidity = Math.round((dayJSON.currently.humidity)*100);
			}
			else
			{
				day_humidity = "N/A";
			}

			var day_visibility;
			if(dayJSON.currently.visibility || dayJSON.currently.visibility == 0)
			{
				day_visibility = dayJSON.currently.visibility;
			}
			else
			{
				day_visibility = "N/A";
			}

			var date_sunrise;
			var date_sunset;
			var day_sunrise;
			var day_sunset;

			if (dayJSON.daily.data[0].sunriseTime && dayJSON.daily.data[0].sunsetTime)
			{
			var date_sunrise = new Date((dayJSON.daily.data[0].sunriseTime + unixOffset)*1000);
			var date_sunset = new Date((dayJSON.daily.data[0].sunsetTime + unixOffset)*1000)

			var day_sunrise = date_sunrise.getUTCHours();
			var day_sunset = date_sunset.getUTCHours();

			//set am/pm values
			if (day_sunrise > 11)
				{document.getElementById("day_sunrise_sub_id").innerHTML = "PM/";}
			else
				{document.getElementById("day_sunrise_sub_id").innerHTML = "AM/";}

			if (day_sunset > 11)
				{document.getElementById("day_sunset_sub_id").innerHTML = "PM";}
			else
				{document.getElementById("day_sunset_sub_id").innerHTML = "AM";}

			//normalize hours
			if (day_sunrise > 12)
			{
				day_sunrise -= 12;
			}

			if (day_sunset > 12)
			{
				day_sunset -= 12;
			}

			if (day_sunrise == 0)
			{
				day_sunrise = 12;
			}

			if (day_sunset == 0)
			{
				day_sunset = 12;
			}
			document.getElementById('day_sunrise_id').innerHTML= day_sunrise;
			document.getElementById('day_sunset_id').innerHTML= day_sunset;
			}
			else
			{
				document.getElementById('day_sunrise_id').innerHTML= "N/A";
				document.getElementById('day_sunset_id').innerHTML= "";
				document.getElementById("day_sunset_sub_id").innerHTML = "";
				document.getElementById("day_sunrise_sub_id").innerHTML = "";
			}
				
			//populate values 
			document.getElementById('day_image').src= day_icon_str;
			document.getElementById('day_summary').innerHTML= day_summary;
			document.getElementById('inner_temp').innerHTML= day_temp;
			document.getElementById('day_precip_id').innerHTML= day_precipitation;
			document.getElementById('day_rain_id').innerHTML= day_chancerain;
			document.getElementById('day_wspeed_id').innerHTML= day_windspeed;
			document.getElementById('day_humid_id').innerHTML= day_humidity;
			document.getElementById('day_visibility_id').innerHTML= day_visibility;


			

			//populate chart
			drawChart();



			//hide other divs and display new divs
			document.getElementById("currentCard").style.display = "none";
			document.getElementById('tableCont').style.display = "none";
			document.getElementById('dayContainer').style.display = "block";
		}
		

		function drawChart()
		{	

      		
		

			//create chart
			var data = new google.visualization.DataTable();
      		data.addColumn('number', 'Time');
      		data.addColumn('number', 'T');

      		//extract data from JSON
			var hour = 0;
			var ctemp;
			while(dayJSON.hourly.data[hour])
			{
				ctemp = dayJSON.hourly.data[hour].temperature;
				data.addRows([[hour,ctemp]]);
				hour++;
			}

     

			var options = 
			{
          	curveType: 'function',
          	legend: { position: 'right' },
          	hAxis: {title: 'Time'},
          	vAxis: {title: 'Temperature'},
          	colors: ['#A8D0D8'],
          	width: 700,
          	height: 200
        	};

        var chart = new google.visualization.LineChart(document.getElementById('chart'));

        chart.draw(data, options);
		}

		//gets and displays info for clicked day.  input is returned unix time
		function getDayInfo(uTime)
		{
            //call php to get info
            var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST", "index.php", true);
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlhttp.onreadystatechange = function() 
			{
    			if (this.readyState === 4 || this.status === 200)
    			{ 
    				//action here
            		var result = this.responseText;
            		dayJSON = JSON.parse(result);
            		console.log(dayJSON);
            		displayDay();
				}       
			};
			xmlhttp.send("d_latitude=" + pLat + "&d_longitude=" + pLong + "&d_time=" + uTime);

		}
		function displayInitial()
		{
			//assingn to permanant vars 
			pLat = gLat;
			pLong = gLong;
			UTCoffset = weatherJSON.offset;
			unixOffset = UTCoffset*60*60;
			//create summary tab.. need to add error checking conditions to this
			document.getElementById('inputCity').innerHTML = inputCity;
			document.getElementById('timezone').innerHTML = weatherJSON.timezone;
			document.getElementById('temperature').innerHTML = weatherJSON.currently.temperature;
			document.getElementById('summary').innerHTML = weatherJSON.currently.summary;

			//add error checking condition for empty string or nonexistent key
			//humidity
			if (weatherJSON.currently.humidity || weatherJSON.currently.humidity == 0)
			{
				document.getElementById('humidity_t').innerHTML = weatherJSON.currently.humidity;
			}
			else
			{
				document.getElementById('humidity_t').innerHTML = "N/A";

			}

			//pressure
			if (weatherJSON.currently.pressure || weatherJSON.currently.pressure == 0)
			{
				document.getElementById('pressure_t').innerHTML = weatherJSON.currently.pressure;
			}
			else
			{
				document.getElementById('pressure_t').innerHTML = "N/A";

			}

			//windspeed
			if (weatherJSON.currently.windSpeed || weatherJSON.currently.windSpeed == 0)
			{
				document.getElementById('windspeed_t').innerHTML = weatherJSON.currently.windSpeed;
			}
			else
			{
				document.getElementById('windspeed_t').innerHTML = "N/A";
			}
			

			//visibility
			if (weatherJSON.currently.visibility || weatherJSON.currently.visibility == 0)
			{
				document.getElementById('visibility_t').innerHTML = weatherJSON.currently.visibility;
			}
			else
			{
				document.getElementById('visibility_t').innerHTML = "N/A";
			}
			

			//cloudcover
			if (weatherJSON.currently.cloudCover || weatherJSON.currently.cloudCover == 0)
			{
				document.getElementById('cloudcover_t').innerHTML = weatherJSON.currently.cloudCover;
			}
			else
			{
				document.getElementById('cloudcover_t').innerHTML = "N/A";

			}

			//ozone
			if (weatherJSON.currently.ozone || weatherJSON.currently.ozone == 0)
			{
				document.getElementById('ozone_t').innerHTML = weatherJSON.currently.ozone;
			}
			else
			{
				document.getElementById('ozone_t').innerHTML = "N/A";

			}

			document.getElementById('currentCard').style.display = "block";

			//create table
			var tblstring = '<tr><th>Date</th><th>Status</th><th>Summary</th><th>TemperatureHigh</th><th>TemperatureLow</th><th>Wind Speed</th></tr>'

			var daycount = 0;
			while(weatherJSON.daily.data[daycount])
			{
				tblstring += '<tr>';
				//get date
				var time = weatherJSON.daily.data[daycount].time;
				var date = new Date((time+unixOffset)*1000);
				tblstring += '<td align = "center">' + date.getUTCFullYear() + '-' + (date.getUTCMonth()+1) + '-' + date.getUTCDate() + '</td>';
				

				//get status
				tblstring += '<td align = "center">';
				var icon = weatherJSON.daily.data[daycount].icon;
				if (icon == "clear-day" || icon =="clear-night")
				{
					tblstring += '<img class = "statusIcon" src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-12-512.png">';
				}
				else if (icon == "rain")
				{
					tblstring += '<img class = "statusIcon" src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-04-512.png">';
				}
				else if (icon == "snow")
				{
					tblstring += '<img class = "statusIcon" src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-19-512.png">';
				}
				else if (icon == "sleet")
				{
					tblstring += '<img class = "statusIcon" src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-07-512.png">';
				}
				else if (icon == "wind")
				{
					tblstring += '<img class = "statusIcon" src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png">';
				}
				else if (icon == "fog")
				{
					tblstring += '<img class = "statusIcon" src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png">';
				}
				else if (icon == "cloudy")
				{
					tblstring += '<img class = "statusIcon" src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-01-512.png">';
				}
				else if (icon == "partly-cloudy-day" || icon == "partly-cloudy-night")
				{
					tblstring += '<img class = "statusIcon" src = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-02-512.png">';
				}

				tblstring += '</td>';

				//get summary
				tblstring += '<td align = "center" style = "width:250px">';
				var summary = weatherJSON.daily.data[daycount].summary;
				tblstring += '<a href = "javascript:getDayInfo(' + time + ')">' +summary + '</a>';
				tblstring += '</td>';

				//get temp high
				tblstring += '<td align = "center">'
				var temperatureHigh = weatherJSON.daily.data[daycount].temperatureHigh;
				tblstring += temperatureHigh;
				tblstring += '</td>';

				//get temp low
				tblstring += '<td align = "center">'
				var temperatureLow = weatherJSON.daily.data[daycount].temperatureLow;
				tblstring += temperatureLow;
				tblstring += '</td>';

				//get windspeed
				tblstring += '<td align = "center">'
				var wSpeed = weatherJSON.daily.data[daycount].windSpeed;
				tblstring += wSpeed;
				tblstring += '</td>';

				//increment day count
				tblstring += '</tr>';
				daycount++;
			}

			document.getElementById('dayContainer').style.display = "none";
			document.getElementById('chart').style.display = "none";
			document.getElementById('arrow_im').src = "https://cdn4.iconfinder.com/data/icons/geosm-e-commerce/18/point-down-512.png";


			document.getElementById('wTable').innerHTML = tblstring;
			document.getElementById('tableCont').style.display = "block";


		}

		function getWeatherData(lat, long)
		{
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST", "index.php", true);
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlhttp.onreadystatechange = function() 
			{
    			if (this.readyState === 4 || this.status === 200)
    			{ 
    				//action here
            		var result = this.responseText;
            		weatherJSON = JSON.parse(result);
            		console.log(weatherJSON);
            		displayInitial();
				}       
			};
			xmlhttp.send("latitude=" + lat + "&longitude=" + long);
		}

		function getLatLong(state, street, city)
		{
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST", "index.php", true);
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlhttp.onreadystatechange = function() 
			{
    			if (this.readyState === 4 || this.status === 200)
    			{ 
    				if (this.responseText == "ERROR")
    				{
    					clearResults();
    					document.getElementById("error").style.display = "block";
    					return;
    				}
    				var stringsLatLong = (this.responseText).split(" ", 2);
    				gLat = stringsLatLong[0];
    				gLong = stringsLatLong[1];
            		getWeatherData(gLat,gLong);


				}       
			};
			xmlhttp.send("state=" + state + "&city=" + city + "&street=" +street);
		}

		function clearResults()
		{
			//clear error if it is there
			document.getElementById("currLocation").checked =false;
			currentLocation();
			document.getElementById("error").style.display = "none";
			document.getElementById("state").value = "state";
			document.getElementById("street").value = "";
			document.getElementById("city").value = "";
			document.getElementById("currentCard").style.display = "none";
			document.getElementById('tableCont').style.display = "none";
			document.getElementById('dayContainer').style.display = "none";
			document.getElementById('chart').style.display = "none";
			document.getElementById('arrow_im').src = "https://cdn4.iconfinder.com/data/icons/geosm-e-commerce/18/point-down-512.png";

			return;

		}

		//function to populate state down fields
		function populateStates()
		{
			var stateObj = JSON.parse('{ "States":[{"Abbreviation":"AL","State":"Alabama"},{"Abbreviation":"AK","State":"Alaska"},{"Abbreviation":"AZ","State":"Arizona"},{"Abbreviation":"AR","State":"Arkansas"},{"Abbreviation":"CA","State":"California"},{"Abbreviation":"CO","State":"Colorado"},{"Abbreviation":"CT","State":"Connecticut"},{"Abbreviation":"DE","State":"Delaware"},{"Abbreviation":"DC","State":"District Of Columbia"},{"Abbreviation":"FL","State":"Florida"},{"Abbreviation":"GA","State":"Georgia"},{"Abbreviation":"HI","State":"Hawaii"},{"Abbreviation":"ID","State":"Idaho"},{"Abbreviation":"IL","State":"Illinois"},{"Abbreviation":"IN","State":"Indiana"},{"Abbreviation":"IA","State":"Iowa"},{"Abbreviation":"KS","State":"Kansas"},{"Abbreviation":"KY","State":"Kentucky"},{"Abbreviation":"LA","State":"Louisiana"},{"Abbreviation":"ME","State":"Maine"},{"Abbreviation":"MD","State":"Maryland"},{"Abbreviation":"MA","State":"Massachusetts"},{"Abbreviation":"MI","State":"Michigan"},{"Abbreviation":"MN","State":"Minnesota"},{"Abbreviation":"MS","State":"Mississippi"},{"Abbreviation":"MO","State":"Missouri"},{"Abbreviation":"MT","State":"Montana"},{"Abbreviation":"NE","State":"Nebraska"},{"Abbreviation":"NV","State":"Nevada"},{"Abbreviation":"NH","State":"New Hampshire"},{"Abbreviation":"NJ","State":"New Jersey"},{"Abbreviation":"NM","State":"New Mexico"},{"Abbreviation":"NY","State":"New York"},{"Abbreviation":"NC","State":"North Carolina"},{"Abbreviation":"ND","State":"North Dakota"},{"Abbreviation":"OH","State":"Ohio"},{"Abbreviation":"OK","State":"Oklahoma"},{"Abbreviation":"OR","State":"Oregon"},{"Abbreviation":"PA","State":"Pennsylvania"},{"Abbreviation":"RI","State":"Rhode Island"},{"Abbreviation":"SC","State":"South Carolina"},{"Abbreviation":"SD","State":"South Dakota"},{"Abbreviation":"TN","State":"Tennessee"},{"Abbreviation":"TX","State":"Texas"},{"Abbreviation":"UT","State":"Utah"},{"Abbreviation":"VT","State":"Vermont"},{"Abbreviation":"VA","State":"Virginia"},{"Abbreviation":"WA","State":"Washington"},{"Abbreviation":"WV","State":"West Virginia"},{"Abbreviation":"WI","State":"Wisconsin"},{"Abbreviation":"WY","State":"Wyoming"}]}');

			var stateString = "<option value = 'state'>State</option><option disabled = 'disabled'>--------------------------------</option>";
			for(i = 0; i< stateObj.States.length; i++)
			{
				stateString += '<option value="' + stateObj.States[i].State + '">' + stateObj.States[i].State + '</option>';
			}

			document.getElementById("state").innerHTML = stateString;
		}

		//function when current location button is selected
		function currentLocation()
		{
			//disable other inputs
			var toDisable = document.getElementsByClassName("wDisable");
			if (document.getElementById("currLocation").checked == true)
			{
				for (var i = 0; i < toDisable.length; i++)
				{
					toDisable[i].value = "";
					toDisable[i].disabled = true;
				}
				document.getElementById("state").value = "state";
				document.getElementById("state").disabled = true;
				document.getElementById("error").style.display = "none";


				//call API to get coordinates
				var r = new XMLHttpRequest();
				r.overrideMimeType("application/json");
				r.onreadystatechange = function() 
				{
    				if (this.readyState == 4 && this.status == 200) 
    				{
    					var obj = JSON.parse(this.responseText);
    					console.log(obj)
						gLat = obj.latitude;
						gLong = obj.longitude;
						inputCity = obj.city;
    				}
    			}
				r.open('GET', 'https://ipapi.co/json', true);
				r.send();
			}

			else
			{
				for (var i = 0; i < toDisable.length; i++)
				{
					toDisable[i].disabled = false;
				}
				document.getElementById("state").disabled = false;

			}
		}



	</script>
</body>
</html>

<?php } ?>
