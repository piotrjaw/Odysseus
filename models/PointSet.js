var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Coordinate = new Schema({
	longtitude: Number,
	latitude: Number,
	altitude: Number
});

var Point = new Schema({
	address: String,
	coordinates: [Coordinate]
});

var PointSetSchema = new Schema({
	username: String,
	filename: String,
	points: [Point]	
});

mongoose.model('PointSet', PointSetSchema);