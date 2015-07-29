exports.getCoordinates = function(target, source) {
	//var coords = String.prototype.split.call(source, " ");
	
	source.forEach(function(coord) {
		var coordinateArray = String.prototype.split.call(coord, ",");
		var coordinates = {
			latitude: coordinateArray[0],
			longitude: coordinateArray[1]
		};
		target.coordinates.push(coordinates);
	});
};