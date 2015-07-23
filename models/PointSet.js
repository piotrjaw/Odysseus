var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Point = new Schema({
	address: String,
	formattedAddress: String,
	placeId: String,
	coordinates: {
		longtitude: Number,
		latitude: Number
	}
});

var PointSetSchema = new Schema({
	username: String,
	filename: String,
	points: [Point]	
});

mongoose.model('PointSet', PointSetSchema);