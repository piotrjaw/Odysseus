/**
 * Created by tigre on 2015-07-20.
 */
var mongoose = require('mongoose');
var functions = require('../functions.js');

var Schema = mongoose.Schema;

var Coordinate = new Schema({
	longtitude: Number,
	latitude: Number,
	altitude: Number
});

var PolygonSchema = new Schema({
    name: String,
	username: String,
	coordinates: [Coordinate],
	importDate: Date
});

PolygonSchema.methods.getPolygonCoordinates = function(source) {
	functions.getCoordinates(this, source);
};

mongoose.model('Polygon', PolygonSchema);