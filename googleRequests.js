var moment = require('moment');

var config = require('./config.json');

var geocoderProvider = 'google';
var httpAdapter = 'https';

var extra = {
	apiKey: config.googleApiKey,
	formatter: null
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

exports.geocode = function(address) {
	global.geocodingQueue.push(address);
	
	var queueTime = false;
	
	var run = setInterval(function() { 
		function checkQueue(givenAddress) {
			if (givenAddress === geocodingQueue[0]) {
				this.queueTime = true;
				clearInterval(run);
			}
		}; 
	}, 200);
	
	geocodingQueue.splice(0, 1);
	
	var result = null;
	
	var query = geocoder.geocode(address)
		.then(function(res) {
			return res[0];
		})
		.then(function(err) {
			console.error(err)
		});
		
};

