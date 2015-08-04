/**
 * Created by tigre on 2015-07-20.
 */
var mongoose = require('mongoose');
var functions = require('../functions.js');

var Schema = mongoose.Schema;

var Coordinate = new Schema({
	latitude: Number,
	longitude: Number
});

var PolygonSchema = new Schema({
    name: String,
	coordinates: [Coordinate],
});

PolygonSchema.methods.getPolygonCoordinates = function(source) {
	functions.getCoordinates(this, source);
};

mongoose.model('Polygon', PolygonSchema);