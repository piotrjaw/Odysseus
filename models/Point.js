/**
 * Created by tigre on 2015-07-30.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PointSchema = new Schema({
    address: String,
    formattedAddress: String,
    placeId: String,
	customId: String,
    coordinates: {
        latitude: Number,
        longitude: Number
    },
	coordinateType: String,
    polygon: { type: Schema.Types.ObjectId, ref: 'Polygon' }
});

mongoose.model('Point', PointSchema);