var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PolygonSetSchema = new Schema({
	username: String,
	filename: String,
	customname: String,
	importDate: Date,
	polygons: [{ type: Schema.Types.ObjectId, ref: 'Polygon'}]
});

mongoose.model('PolygonSet', PolygonSetSchema);