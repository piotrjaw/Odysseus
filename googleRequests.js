var config = require('./config.json');

var geocoderProvider = 'google';
var httpAdapter = 'https';

var extra = {
	apiKey: config.googleApiKey,
	formatter: null
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

exports.geocode = function(address) {
	/* PONIŻEJ DODAĆ KOLEJKOWANIE*/
};

exports.asyncGeocode = function(address) {
	return new Promise(function(resolve, reject){
		resolve(geocoder.geocode(address)
			.then(function(res){
				return(res[0]);
			}));
	});
};