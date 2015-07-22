var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Coordinate = new Schema({
	longtitude: Number,
	latitude: Number,
	altitude: Number
});

var PointSchema = new Schema({
	filename: String,
	address: String,
	coordinates: [Coordinate]
});

mongoose.model('Point', PointSchema);