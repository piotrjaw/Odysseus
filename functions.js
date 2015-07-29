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