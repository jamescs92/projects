var express = require('express');
var app = express();
var cors = require('cors');
var request = require('request');
var options;

app.use(cors())

//autofill for city
app.get('/autofill', function (req, res) {
var string = req.query.string;
options = 
{
	url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + string + '&types=(cities)&language=en&key=AIzaSyDnnhY1hozEILv_5B3CB9tYgxgrT_itTsY',
	method: 'GET'
}

request(options, function(error, response, body){res.send(body);});
});

//geocode to get lat/long
app.get('/geocode', function (req, res) {
var street = req.query.street;
var city= req.query.city;
var state = req.query.state;
options = 
{
	url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + street + ',' + city + ',' + state + '&key=AIzaSyCw3TBGXKX4NYvK-w1aVUpYQhn1HPdfAMU',
	method: 'GET'
}
request(options, function(error, response, body){res.send(body);});
});

//initial call to dark sky
app.get('/darkskyinitial', function (req, res) {
var latitude = req.query.latitude;
var longitude = req.query.longitude;
options = 
{
	url: 'https://api.darksky.net/forecast/03323b7f89bfa50d0d0f86b39f268d37/' + latitude + ',' + longitude,
	method: 'GET'
}
request(options, function(error, response, body){res.send(body);});
});


//modal call to dark sky
app.get('/darkskymodal', function (req, res) {
var latitude = req.query.latitude;
var longitude = req.query.longitude;
var unixtime = req.query.unixtime;
options = 
{
	url: 'https://api.darksky.net/forecast/03323b7f89bfa50d0d0f86b39f268d37/' + latitude + ',' + longitude + ',' + unixtime,
	method: 'GET'
}
request(options, function(error, response, body){res.send(body);});
});

//get state seal
app.get('/stateseal', function (req, res) {
var state = req.query.state;
options = 
{
	url: 'https://www.googleapis.com/customsearch/v1?q=' + state + '%20State%20Seal&cx=010448438812262886461:zswoe498kat&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyDnnhY1hozEILv_5B3CB9tYgxgrT_itTsY',
	method: 'GET'
}
request(options, function(error, response, body){res.send(body);});
});

//server listening on port 3000
app.listen(3000);