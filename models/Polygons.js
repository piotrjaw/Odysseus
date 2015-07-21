/**
 * Created by tigre on 2015-07-20.
 */
var mongoose = require('mongoose');

var PolygonSchema = new mongoose.Schema({
    name: String,
	coordinates: [{
		longtitude: Number,
		lattitude: Number,
		altitude: Number
	}],
	importDate: Date
});

mongoose.model('Polygon', PolygonSchema);