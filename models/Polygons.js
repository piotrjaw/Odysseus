/**
 * Created by tigre on 2015-07-20.
 */
var mongoose = require('mongoose');

var PolygonSchema = new mongoose.Schema({
    name: String,
    polygon: {
        outerBondaryIs: {
            linearRing: {
                tesselate: Boolean,
                coordinates: [{
                    longtitude: Number,
                    lattitude: Number,
                    altitude: Number
                }]
            }
        }
    }
});

mongoose.model('Polygon', PolygonSchema);