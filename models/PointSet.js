var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PointSetSchema = new Schema({
	username: String,
	filename: String,
	importDate: Date,
	points: [{ type: Schema.Types.ObjectId, ref: 'Point'}]
});

mongoose.model('PointSet', PointSetSchema);