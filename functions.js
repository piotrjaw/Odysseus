var request = require('request-promise');
var _ = require('underscore');

exports.getCoordinates = function(target, source) {
	var coords = String.prototype.split.call(source, " ");
	
	coords.forEach(function(coord) {
		var coordinateArray = String.prototype.split.call(coord, ",");
		var coordinates = {
			longtitude: coordinateArray[0],
			latitude: coordinateArray[1],
			altitude: coordinateArray[2]
		};
		target.coordinates.push(coordinates);
	});
};

exports.geocode = function (location, callback) {

	var options = {address: location, key: 'AIzaSyCf_VWbxCEZ8oWepMe92tfUWXhJz6xd2fY'};
	var uri = 'https://maps.googleapis.com/maps/api/geocode/json';

	request({
		uri: uri,
		qs: options
	}).then(function (response) {
		var result = JSON.parse(response);
		callback(result);
	});
};