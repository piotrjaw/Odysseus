/**
 * Created by tigre on 2015-07-20.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Point = new Schema({
	longtitude: Number,
	latitude: Number,
	altitude: Number
});

var PolygonSchema = new Schema({
    name: String,
	username: String,
	coordinates: [Point],
	importDate: Date
});

mongoose.model('Polygon', PolygonSchema);