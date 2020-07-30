import { Component } from '@angular/core';
import { DataFetchService } from './data-fetch.service';
import * as CanvasJS from './canvasjs.min';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  hourSelected;
  weeklyCreated;
  wasError;
  recordsNone;
  modalOpen;
  locationCheck;
  starStyle;
  starIcon;
  resultsStyle;
  favoritesStyle;
  //current card vars
  currentTimezone;
  currentTemp;
  currentSummary;

  currentArray = [{image: "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png", value: 5, tooltip: "humidity"}];

  stateSealURL = "";
  progressBar = "none";
  searchDisabled = true;
  showBottom = "container-fluid d-none";

  myControl = new FormControl('');
  options = [];

  autoChange()
  {
    this.checkForm();
    console.log("change detected");
    if (this.myControl.value == '')
    {
      this.options = [];
    }
    else
    {
      //make api call to get autocomplete

        var url = 'http://Weathernode2-env.heajgjjrih.us-east-2.elasticbeanstalk.com/autofill?string=' + (this.myControl.value).split(' ').join('+');

        this.dataFetchService.getData(url).subscribe((data: any)=>{
        console.log(data);
        var count = 0;
        var optionsTemp = [];
        while(count < 5 && (data.predictions[count] != null))
        {
          optionsTemp.push(data.predictions[count].structured_formatting.main_text);
          count++;
        }
        this.options = optionsTemp;
        });
    }
  }

  

  //end form control

  //array to hold favorites objects
  favoritesArray:any = [{image: "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png",city: "blah",state: "CA",key: ""}];

  stateObj: any = {};
  twitterString;
  checkCity ='';
  permCity = '';
  //bar charts info
  
  barChartType = 'bar';
  barChartLegend = true;
  barChartLabels: number[] = [];

  //changes for each data set
  barDataArr = [[],[],[],[],[],[]];
  barLabelArr = ['Temperature','Pressure','Humidity','Ozone','Visibility','Wind Speed'];
  barYaxisArr= ['Fahrenheit','Millibars','%','Dobson Units','Miles','Miles Per Hour'];
  barDataCurr = this.barDataArr[0];
  barLabelCurr = this.barLabelArr[0];
  barYaxisCurr = this.barYaxisArr[0];

  barChartOptions = {
    responsive: true,
    scales: {
    yAxes: [{
    ticks: 
      {
        maxTicksLimit: 8
      },
      scaleLabel: 
      {
        display: true,
        labelString: this.barYaxisCurr
      }
    }],
    xAxes: [{
      scaleLabel: 
      {
        display: true,
        labelString: 'Time difference from current hour'
      }
    }],
  }     
  };


  barChartData = [{data: this.barDataCurr, label: this.barLabelCurr, backgroundColor:"#82caf1", hoverBackgroundColor: "#1e2eb8"}];
  //end bar charts info

  //for tabs

  aselected_current = "true";
  aselected_hourly = "false";
  aselected_weekly = "false"

  liclass_current = "nav-link active";
  liclass_hourly = "nav-link";
  liclass_weekly = "nav-link";

  divclass_current = "tab-pane fade show active";
  divclass_hourly = "tab-pane fade";
  divclass_weekly = "tab-pane fade";

  //end tabs 

  //array for hourly drop down
  dropSelected = 0;

  resultsShow = "block";
  favoritesShow = "none"
  

  streetable = false;
  cityable = false;
  stateable = false;
  states = [];

  initialDarkJSON: any = {};
  stateJSON: any = {};

  street = "";
  city = "";
  state = "Select State";

  stateForLogo;
  stateForLogoInit;

  isChecked = false;

  //links
  IPlink = "http://ip-api.com/json";

  latChecked;
  longChecked;

  latFinal;
  longFinal;

  //modal window stuff
  closeResult: string;
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.modalOpen = 0;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  //end modal window stuff

  streetDisp;
  cityDisp;
  constructor(private dataFetchService: DataFetchService, private modalService: NgbModal) { }
  ngOnInit() 
  {
      this.hourSelected = "Temperature";
      this.weeklyCreated = 0;
      this.wasError = 0;
      this.recordsNone = "none";
      this.modalOpen = 0;
      this.locationCheck = false;
      this.starIcon = "star_border";
      this.starStyle = "black"
      this.resultsClicked();
      //
      this.streetDisp = "none";
      this.cityDisp = "none";

      //refresh favorites
      this.favRefresh();
     //Fill in chart data
      for (var i = 0; i<24; i++)
      {
        this.barChartLabels[i] = i;
      }

  	this.stateObj = JSON.parse('{ "States":[{"Abbreviation":"AL","State":"Alabama"},{"Abbreviation":"AK","State":"Alaska"},{"Abbreviation":"AZ","State":"Arizona"},{"Abbreviation":"AR","State":"Arkansas"},{"Abbreviation":"CA","State":"California"},{"Abbreviation":"CO","State":"Colorado"},{"Abbreviation":"CT","State":"Connecticut"},{"Abbreviation":"DE","State":"Delaware"},{"Abbreviation":"DC","State":"District Of Columbia"},{"Abbreviation":"FL","State":"Florida"},{"Abbreviation":"GA","State":"Georgia"},{"Abbreviation":"HI","State":"Hawaii"},{"Abbreviation":"ID","State":"Idaho"},{"Abbreviation":"IL","State":"Illinois"},{"Abbreviation":"IN","State":"Indiana"},{"Abbreviation":"IA","State":"Iowa"},{"Abbreviation":"KS","State":"Kansas"},{"Abbreviation":"KY","State":"Kentucky"},{"Abbreviation":"LA","State":"Louisiana"},{"Abbreviation":"ME","State":"Maine"},{"Abbreviation":"MD","State":"Maryland"},{"Abbreviation":"MA","State":"Massachusetts"},{"Abbreviation":"MI","State":"Michigan"},{"Abbreviation":"MN","State":"Minnesota"},{"Abbreviation":"MS","State":"Mississippi"},{"Abbreviation":"MO","State":"Missouri"},{"Abbreviation":"MT","State":"Montana"},{"Abbreviation":"NE","State":"Nebraska"},{"Abbreviation":"NV","State":"Nevada"},{"Abbreviation":"NH","State":"New Hampshire"},{"Abbreviation":"NJ","State":"New Jersey"},{"Abbreviation":"NM","State":"New Mexico"},{"Abbreviation":"NY","State":"New York"},{"Abbreviation":"NC","State":"North Carolina"},{"Abbreviation":"ND","State":"North Dakota"},{"Abbreviation":"OH","State":"Ohio"},{"Abbreviation":"OK","State":"Oklahoma"},{"Abbreviation":"OR","State":"Oregon"},{"Abbreviation":"PA","State":"Pennsylvania"},{"Abbreviation":"RI","State":"Rhode Island"},{"Abbreviation":"SC","State":"South Carolina"},{"Abbreviation":"SD","State":"South Dakota"},{"Abbreviation":"TN","State":"Tennessee"},{"Abbreviation":"TX","State":"Texas"},{"Abbreviation":"UT","State":"Utah"},{"Abbreviation":"VT","State":"Vermont"},{"Abbreviation":"VA","State":"Virginia"},{"Abbreviation":"WA","State":"Washington"},{"Abbreviation":"WV","State":"West Virginia"},{"Abbreviation":"WI","State":"Wisconsin"},{"Abbreviation":"WY","State":"Wyoming"}]}');

    
    for (var i = 0;i<this.stateObj.States.length;i++)
    {
      this.states[i] = this.stateObj.States[i].State;
    }
  }

  //disables inputs and gets lat/long
  disableInputs(event)
  {
    if(event.target.checked === true)
    {
      this.progressBar = "block";
      this.streetable = true;
      this.cityable = true;
      this.stateable = true;
      this.isChecked = true;
      this.cityDisp = "none";
      this.streetDisp = "none";
      this.myControl.disable();

      //call request to get lat and long
      this.dataFetchService.getData(this.IPlink).subscribe((data: any)=>{
      console.log(data);
      this.latChecked = data.lat;
      this.longChecked = data.lon;
      this.checkCity = data.city;
      this.stateForLogoInit = data.regionName;
      console.log(this.latChecked);
      console.log(this.longChecked);
      this.searchDisabled = false;
      this.progressBar = "none";
      })
 
    }
    else
    {
      this.streetable = false;
      this.cityable = false;
      this.stateable = false;
      this.isChecked = false;
      this.myControl.enable();
      this.checkForm();

    }
  }

  //when search button is clicked
    searchClicked()
    {
      this.weeklyCreated = 0;
      this.wasError = 0;
      this.recordsNone = "none";
      this.starIcon = "star_border";
      this.starStyle = "black";
      this.progressBar = "block";
      this.isFav = 0;
      if(this.isChecked == true)
      {
        //get lat and long into global vars
        this.latFinal = this.latChecked;
        this.longFinal = this.longChecked;
        this.stateForLogo = this.stateForLogoInit;
        console.log(this.latFinal);
        console.log(this.longFinal);
        console.log(this.stateForLogo);
        this.permCity= this.checkCity;
        this.getInitDark();


      }
      else
      {
        console.log("unchecked");
        //error check the inputs

        //get lat and long from API call
        var url = 'http://Weathernode2-env.heajgjjrih.us-east-2.elasticbeanstalk.com/geocode?street=' + (this.street).split(' ').join('+') + '&city=' + (this.myControl.value).split(' ').join('+') + '&state=' + (this.state).split(' ').join('+');
        this.permCity= this.myControl.value;

        //var url = "http://Weathernode2-env.heajgjjrih.us-east-2.elasticbeanstalk.com/stateseal?state=California"; 
        //var url = "http://Weathernode2-env.heajgjjrih.us-east-2.elasticbeanstalk.com/geocode?street=327+Ramon+Drive&city=Los+Altos&state=California"

        this.dataFetchService.getData(url).subscribe((data: any)=>{
        console.log(data);

        if(data.status != "OK")
        {

          console.log("error");
          this.showBottom = "container-fluid d-none";
          this.progressBar = "none";
          if (this.favoritesShow != "block")
          {
             this.recordsNone = "block";
          }
          this.wasError = 1;
          return;
        }
        this.latFinal = data.results[0].geometry.location.lat;
        this.longFinal = data.results[0].geometry.location.lng;

        console.log(this.latFinal);
        console.log(this.longFinal);
        this.stateForLogo = this.state;
        console.log(this.stateForLogo);
        this.getInitDark();


        });
        
      }
      //now call func to fetch initial dark sky info and seal
      
    }

    //Get info from dark sky and call func to get state seal
    getInitDark()
    {
      //darksky
      var urlDark = "http://Weathernode2-env.heajgjjrih.us-east-2.elasticbeanstalk.com/darkskyinitial?latitude=" + this.latFinal + "&longitude=" + this.longFinal;

      this.dataFetchService.getData(urlDark).subscribe((data: any)=>{
      this.initialDarkJSON = data;
      console.log(typeof data);
      console.log(this.initialDarkJSON);
      this.getStateSeal();
      });
    }

    getStateSeal()
    {
      var urlState= "http://Weathernode2-env.heajgjjrih.us-east-2.elasticbeanstalk.com/stateseal?state=" + (this.stateForLogo).split(' ').join('+');

      this.dataFetchService.getData(urlState).subscribe((data: any)=>{
      this.stateJSON = data;
      console.log(this.stateJSON);
      this.stateSealURL = this.stateJSON.items[0].link;
      this.dispInitial();
      })
    }

    //fill in data for charts etc
    dispInitial()
    {
      //fill in current card
      this.currentTimezone = this.initialDarkJSON.timezone;
      this.currentTemp = Math.round(this.initialDarkJSON.currently.temperature);
      this.currentSummary = this.initialDarkJSON.currently.summary;

      //fill in array to populate bottom of current card
      let tempArr: any  = [];
      var currI = 0;
      let tempObj: any = {};

      //Humidity
      if(this.initialDarkJSON.currently.humidity != null && this.initialDarkJSON.currently.humidity != 0)
      {
        tempObj.value = this.initialDarkJSON.currently.humidity;
        tempObj.image = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png";
        tempObj.tooltip = "Humidity";
        tempArr.push(tempObj);
      }

      //Pressure
      if(this.initialDarkJSON.currently.pressure != null && this.initialDarkJSON.currently.pressure != 0)
      {
        tempObj = {};
        tempObj.value = this.initialDarkJSON.currently.pressure;
        tempObj.image = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png";
        tempObj.tooltip = "Pressure";
        tempArr.push(tempObj);
      }
      //Wind Speed
      if(this.initialDarkJSON.currently.windSpeed != null && this.initialDarkJSON.currently.windSpeed != 0)
      {
        tempObj = {};
        tempObj.value = this.initialDarkJSON.currently.windSpeed;
        tempObj.image = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png";
        tempObj.tooltip = "Wind Speed";
        tempArr.push(tempObj);
      }

      //Visbility
      if(this.initialDarkJSON.currently.visibility != null && this.initialDarkJSON.currently.visibility != 0)
      {
        tempObj = {};
        tempObj.value = this.initialDarkJSON.currently.visibility;
        tempObj.image = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png";
        tempObj.tooltip = "Visibility";
        tempArr.push(tempObj);
      }

      //CloudCover
      if(this.initialDarkJSON.currently.cloudCover != null && this.initialDarkJSON.currently.cloudCover != 0)
      {
        tempObj = {};
        tempObj.value = this.initialDarkJSON.currently.cloudCover;
        tempObj.image = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png";
        tempObj.tooltip = "Cloud Cover";
        tempArr.push(tempObj);
      }

      //Ozone
      if(this.initialDarkJSON.currently.ozone != null && this.initialDarkJSON.currently.ozone != 0)
      {
        tempObj = {};
        tempObj.value = this.initialDarkJSON.currently.ozone;
        tempObj.image = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png";
        tempObj.tooltip = "Ozone";
        tempArr.push(tempObj);
      }

      this.currentArray = tempArr;


      //set up twitter string
      this.twitterString = "https://twitter.com/intent/tweet?text=The%20current%20temperature%20at%20" + (this.permCity).split(' ').join('%20') + "%20is%20" + Math.round(this.initialDarkJSON.currently.temperature) + "%C2%B0%20F.%20The%20weather%20conditions%20are%20" + this.initialDarkJSON.currently.summary + ".%20%23CSCI571WeatherSearch";

      //get bar chart data array for each chart
      for(var i = 0; i < 6; i++)
      {
        for(var j = 0; j<24;j++)
        {
          if (i == 0)
          {(this.barDataArr[i])[j] = this.initialDarkJSON.hourly.data[j].temperature;}
          if (i == 1)
          {(this.barDataArr[i])[j] = this.initialDarkJSON.hourly.data[j].pressure;}
          if (i == 2)
          {(this.barDataArr[i])[j] = this.initialDarkJSON.hourly.data[j].humidity;}
          if (i == 3)
          {(this.barDataArr[i])[j] = this.initialDarkJSON.hourly.data[j].ozone;}
          if (i == 4)
          {(this.barDataArr[i])[j] = this.initialDarkJSON.hourly.data[j].visibility;}
          if (i == 5)
          {(this.barDataArr[i])[j] = this.initialDarkJSON.hourly.data[j].windSpeed;}
          
        }
      }
      this.progressBar = "none";
      this.changeTabcurrent();

      this.showBottom = "container-fluid";


    }

    weeklyBarInfo: any = {};

    createWeeklyChart()
    {
    var dataPointsArr = [];
    var c = 0;
    var ind = 80;
    while(this.initialDarkJSON.daily.data[c]!=null)
    {
      var low = Math.round(this.initialDarkJSON.daily.data[c].temperatureLow);
      var high = Math.round(this.initialDarkJSON.daily.data[c].temperatureHigh);
      var timeStamp = this.initialDarkJSON.daily.data[c].time;
      var offset = this.initialDarkJSON.offset;
      timeStamp = timeStamp + (offset*60*60);
      var date = new Date(timeStamp*1000);
      console.log(timeStamp);
      var dateStr = (date.getUTCMonth()+1) + "/" + date.getUTCDate() + "/" + date.getUTCFullYear();

      var temp: any = {};
      temp.x = ind;
      temp.y = [low,high];
      temp.label = dateStr;
      dataPointsArr.push(temp);
      c++;
      console.log(dataPointsArr);
      ind-=10;
    }

    this.weeklyBarInfo = {animationEnabled: true,
    exportEnabled: true,
    dataPointWidth:20,
    legend: {
       horizontalAlign: "center",
       verticalAlign: "top",
     },
    title: {
    text: "Weekly Weather"
    },
    axisX: {
      title: "Days"
    },
    axisY: 
    {
      includeZero: false,
      title: "Temperature in Fahrenheit",
      interval: 10,
      gridThickness: 0
    }, 
    data: [{
      color: "rgb(130,202,241)",
      click: this.barClicked,
      type: "rangeBar",
      showInLegend: true,
      yValueFormatString: "#0",
      indexLabel: "{y[#index]}",
      legendText: "Day Wise Temperature Range",
      toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
    dataPoints: [
    ]
      }]
      }
    this.weeklyBarInfo.data[0].dataPoints = dataPointsArr;
    var chart = new CanvasJS.Chart("chartContainer", this.weeklyBarInfo);
    chart.render();
    }

    modalJSON: any = {};
    already = 0;
    barClicked = (event) =>
    {
      if(this.modalOpen == 0)
      {
        var eventIndex = event.dataPointIndex;
        var timeStamp = this.initialDarkJSON.daily.data[eventIndex].time;
        this.modalOpen = 1;

        //fetch data 
        var urlModal= "http://Weathernode2-env.heajgjjrih.us-east-2.elasticbeanstalk.com/darkskymodal?latitude=" + this.latFinal + "&longitude=" + this.longFinal + "&unixtime=" + timeStamp;

        this.dataFetchService.getData(urlModal).subscribe((data: any)=>{
        this.modalJSON = data;
        console.log(this.modalJSON);
        this.barClickedDisp();
        });
      }


   
    };

    modalDate;
    modalPrecipitation;
    modalChanceOfRain;
    modalWindSpeed;
    modalHumidity;
    modalVisibility;
    modalTemperature;
    modalConditions;
    modalImageSource;

    barClickedDisp()
    {
      console.log("modal");

      var timeStamp = this.modalJSON.currently.time;
      var offset = this.initialDarkJSON.offset;
      timeStamp = timeStamp + (offset*60*60);
      var date = new Date(timeStamp*1000);
      console.log(timeStamp);
      this.modalDate = (date.getUTCMonth()+1) + "/" + date.getUTCDate() + "/" + date.getUTCFullYear();

      switch(this.modalJSON.currently.icon)
      {
        case "clear-day":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
          break;
        case "clear-night":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
          break;
        case "rain":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
          break;
        case "snow":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
          break;
        case "sleet":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
          break;
        case "wind":
          this.modalImageSource = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
          break;
        case "fog":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
          break;
        case "cloudy":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
          break;
        case "partly-cloudy-day":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
          break;
        case "partly-cloudy-night":
          this.modalImageSource = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
          break;
      }
      if (this.modalJSON.currently.temperature != null)
      {
        this.modalTemperature = Math.round(this.modalJSON.currently.temperature);
      }
      else
      {
        this.modalTemperature = 'N/A';
      }

      if (this.modalJSON.currently.summary != null)
      {
        this.modalConditions = this.modalJSON.currently.summary;
      }
      else
      {
        this.modalConditions = 'N/A';
      }

      if (this.modalJSON.currently.precipIntensity != null)
      {
        this.modalPrecipitation = Math.round(this.modalJSON.currently.precipIntensity*100)/100;
      }
      else
      {
        this.modalPrecipitation = 'N/A';
      }


      if (this.modalJSON.currently.precipProbability != null)
      {
        this.modalChanceOfRain = Math.round(this.modalJSON.currently.precipProbability*100);
      }
      else
      {
        this.modalChanceOfRain = 'N/A';
      }

      //
      if (this.modalJSON.currently.windSpeed != null)
      {
        this.modalWindSpeed = Math.round(this.modalJSON.currently.windSpeed*100)/100; 
      }
      else
      {
        this.modalWindSpeed = 'N/A';
      }



      if (this.modalJSON.currently.humidity != null)
      {
        this.modalHumidity = Math.round(this.modalJSON.currently.humidity*100);
      }
      else
      {
        this.modalHumidity = "N/A";
      }

      if (this.modalJSON.currently.visibility != null)
      {
        this.modalVisibility = Math.round(this.modalJSON.currently.visibility*100)/100;
      }
      else
      {
        this.modalVisibility = "N/A";
      }



      //did this as a workaround to popup block in web browser
      let ex: HTMLElement = document.getElementById('modalButton') as HTMLElement;
      ex.click();

    }


    changeTabhourly()
    {
      this.liclass_current = "nav-link";
      this.liclass_hourly = "nav-link active";
      this.liclass_weekly = "nav-link";

      this.divclass_current = "tab-pane fade";
      this.divclass_hourly = "tab-pane fade show active";
      this.divclass_weekly = "tab-pane fade";
    }

    changeTabcurrent()
    {
      this.liclass_current = "nav-link active";
      this.liclass_hourly = "nav-link";
      this.liclass_weekly = "nav-link";

      this.divclass_current = "tab-pane fade show active";
      this.divclass_hourly = "tab-pane fade";
      this.divclass_weekly = "tab-pane fade";
    }

    changeTabweekly()
    {
      this.liclass_current = "nav-link";
      this.liclass_hourly = "nav-link";
      this.liclass_weekly = "nav-link active";

      this.divclass_current = "tab-pane fade";
      this.divclass_hourly = "tab-pane fade";
      this.divclass_weekly = "tab-pane fade show active";
      if (this.weeklyCreated == 0)
      {
        setTimeout(this.weeklyHelper,400);
      }
    }

    weeklyHelper = () =>{
    this.weeklyCreated = 1;
    this.createWeeklyChart();
    }






    resultsClicked()
    {
      this.favoritesShow= "none";
      this.resultsShow= "block"; 
      this.resultsStyle = "rgb(74,134,165)";
      this.favoritesStyle = "white";
      if (this.wasError == 1)
      {
        this.recordsNone = "block";
      }


    }

    favoritesClicked()
    {
      this.resultsShow= "none";
      this.favoritesShow= "block";
      this.resultsStyle = "white";
      this.favoritesStyle = "rgb(74,134,165)";
      this.recordsNone = "none";
    }

    //change drop down to different option
    changeDrop(event){
    console.log("drop");
    var barIndex;
    console.log(this.hourSelected);
    if (this.hourSelected == 'Temperature'){barIndex = 0};
    if (this.hourSelected == 'Pressure'){barIndex = 1};
    if (this.hourSelected == 'Humidity'){barIndex = 2};
    if (this.hourSelected == 'Ozone'){barIndex = 3};
    if (this.hourSelected == 'Visibility'){barIndex = 4};
    if (this.hourSelected == 'Windspeed'){barIndex = 5};

    console.log(barIndex);

    
      this.barLabelCurr = this.barLabelArr[barIndex];
      this.barYaxisCurr = this.barYaxisArr[barIndex];
      this.barDataCurr = this.barDataArr[barIndex];
      

    this.barChartData = [{data: this.barDataCurr, label: this.barLabelCurr, backgroundColor:"#82caf1", hoverBackgroundColor: "#1e2eb8"}];
    this.barChartOptions = {
    responsive: true,
    scales: {
    yAxes: [{
      ticks: 
      {
        maxTicksLimit: 8
      },
      scaleLabel: 
      {
        display: true,
        labelString: this.barYaxisCurr
      }
    }],
    xAxes: [{
      scaleLabel: 
      {
        display: true,
        labelString: 'Time difference from current hour'
      }
    }],

  }     
  };
      console.log(this.barLabelCurr);
      //this.dropStatus[event.originalTarget.selectedIndex] = "block";
      //this.dropSelected = event.originalTarget.selectedIndex;
    }

    //addfavorites button clicked
    favAdd()
    {
      this.isFav = 1;
      var abbv;
      console.log('fav selected');
      //get state abbv
      var i = 0;
      while(this.stateObj.States[i] != null)
      {
        if (this.stateForLogo == this.stateObj.States[i].State)
        {
          abbv = this.stateObj.States[i].Abbreviation;
          break;
        }
        i++;
      }
      console.log(abbv);

      var key = this.latFinal + "&" + this.longFinal;
      console.log(key);
      var val = this.permCity + "&" + abbv + "&" + this.stateJSON.items[0].link;
      console.log(val);

      //add to local storage
      localStorage.setItem(key, val);
      this.starIcon = "star";
      this.starStyle = "orange";
      this.favRefresh();

    }

    favoritesNone;
    favTableShow;
    //refresh favorites
    favRefresh()
    {
      let temparr: any = [];
      if (localStorage.length == 0)
      {
        this.favoritesArray = [];
        this.favTableShow = "none";
        this.favoritesNone = "block";
      }
      else
      {
        for (var i = 0; i < localStorage.length; i++)
        {
          var key = localStorage.key(i)
          console.log(key);
          var val = localStorage.getItem(key);
          console.log(val);
          var split = val.split("&");

          let obj:any = {};
          obj.image = split[2];
          obj.state = split[1];
          obj.city = split[0];
          obj.key = key;
          temparr.push(obj);

        }
        this.favoritesArray = temparr;
        this.favTableShow = "block";
        this.favoritesNone = "none";
      }
    }

    removeFav(key)
    {
      console.log(key);
      localStorage.removeItem(key);
      var split = key.split("&");
      if (this.latFinal == split[0] && this.longFinal == split[1])
      {
        this.starIcon = "star_border";
        this.starStyle = "black";
      }
      this.favRefresh();
    }

    isFav = 0;
    goToFav(key, city,stateAbbv)
    {
      this.isFav = 1;
      console.log("going to fav");
      var split = key.split("&");
      this.latFinal = split[0];
      this.longFinal = split[1];
      this.permCity = city;
      //get state as well
      var i = 0;
      while(this.stateObj.States[i] != null)
      {
        if (stateAbbv == this.stateObj.States[i].Abbreviation)
        {
          this.stateForLogo = this.stateObj.States[i].State;
          break;
        }
        i++;
      }
      console.log(this.stateForLogo);
      this.progressBar = "block";
      this.starIcon = "star";
      this.starStyle = "orange";
      this.weeklyCreated = 0;
      this.getInitDark();
    }

    focusOut(event)
    {
      console.log("focused out");
      console.log(event);
      if(event.srcElement.attributes.id.nodeValue == "inputStreet")
      {
        if (!(/\S/.test(this.street)))
        {
        this.streetDisp = "inline";
        } 
      }
      else
      {
        if (!(/\S/.test(this.myControl.value)))
        {
        this.cityDisp = "inline";
        } 
      }
    }

    focusIn(event)
    {
      console.log("focused in");
      console.log(event);
      if(event.srcElement.attributes.id.nodeValue == "inputStreet")
      {
        this.streetDisp = "none";
      }
      else
      {
        this.cityDisp = "none";
      }
    }

    checkForm()
    {
      console.log(this.street);
      console.log(this.myControl.value);
      console.log(this.state);
      if ((/\S/.test(this.street)) && (/\S/.test(this.myControl.value)) && this.state != '' && this.state != 'Select State')
      {
        this.searchDisabled = false;
      }
      else
      {
      console.log('denied');
        this.searchDisabled = true;
      }
    }

    locCheckLink;
    clear()
    {
      this.showBottom = "container-fluid d-none";
      this.resultsClicked();
      this.street = '';
      this.state =  'Select State';
      this.myControl.setValue('');
      this.cityDisp = "none";
      this.streetDisp = "none";

      
      this.isChecked = false;
      this.locCheckLink = false;

      this.streetable = false;
      this.cityable = false;
      this.stateable = false;
      this.isChecked = false;
      this.myControl.enable();
      this.checkForm();
      this.recordsNone = "none";
      this.wasError = 0;

    }

}
