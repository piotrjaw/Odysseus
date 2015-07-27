var moment = require('moment');

global.geocodingQueue = [];

exports.geocode = function(address) {
	global.geocodingQueue.push(address);
};

var geocodeService = setInterval(function() {
	if (global.geocodingQueue.length > 0) {
		
	}
}, 200);

