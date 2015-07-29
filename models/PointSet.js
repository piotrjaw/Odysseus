var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Point = new Schema({
	address: String,
	formattedAddress: String,
	placeId: String,
	coordinates: {
		latitude: Number,
		longitude: Number
	},
	polygon: { type: Schema.Types.ObjectId, ref: 'Polygon' }
});

var PointSetSchema = new Schema({
	username: String,
	filename: String,
	importDate: Date,
	points: [Point]	
});

mongoose.model('PointSet', PointSetSchema);