var express = require('express');
var router = express.Router();

var passport = require('passport');
var moment = require('moment');
var jwt = require('express-jwt');

var inside = require('point-in-polygon');

var config = require('../config.json');

var gr = require('../googleRequests.js');

var auth = jwt({secret: config.secret, userProperty: 'payload'});

var mongoose = require('mongoose');

var Promise = require('bluebird');
var eachSeriesAsync = Promise.promisify(require('async').eachSeries);

var User = mongoose.model('User');
var Polygon = mongoose.model('Polygon');
var Point = mongoose.model('Point');
var PointSet = mongoose.model('PointSet');
var PolygonSet = mongoose.model('PolygonSet');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST - register new user */
router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password || !req.body.email) {
		return res.status(400).json({message: 'Proszê wype³niæ wszystkie pola.'});
	}

	var user = new User();

	user.username = req.body.username;
	user.email = req.body.email;
	user.creationDate = moment();

	user.setPassword(req.body.password);

	user.save(function(err) {
		if(err) { return next(err); }

		return res.status(200).json({ token: user.generateJWT() });
	});
});

/* POST - login */
router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Proszê wype³niæ wszystkie pola.'});
	}

	passport.authenticate('local', function(err, user, info) {
		if(err){ return next(err); }

		if(user){
			return res.json({ token: user.generateJWT() });
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
});

/* POST user's polygon set */
router.post('/importPolygons', auth, function(req, res, next) {
	if(!req.body.polygons) { return res.status(400).json({ message: 'Brak danych o obszarach.' }) }
	
	var entries = Array.prototype.slice.call(req.body.polygons, 0);

	var PolygonSet = new PolygonSet();
	polygonSet.username = req.payload.username;
	polygonSet.filename = req.body.filename;
	polygonSet.importDate = moment();
	
	var errorArray = [];
	
	entries.forEach(function(entry) {
		var polygon = new Polygon();

		polygon.name = entry.name;
		polygon.username = req.payload.username;
		polygon.importDate = moment();
		polygon.coordinates = [];

		polygon.getPolygonCoordinates(entry.coordinates);
		
		polygon.save(function (err) {
			errorArray.push(err);
			if (errorArray.length === entries.length) { return res.status(200).json({ message: 'OK' }) }
		});
	});
});

/* POST user's point set */
router.post('/importPoints', auth, function(req, res, next) {
	if (!req.body.points) { return res.status(400).json({ message: 'Brak danych o punktach.' }) }
	
	var entries = Array.prototype.slice.call(req.body.points);
	
	var pointSet = new PointSet();
	pointSet.username = req.payload.username;
	pointSet.filename = req.body.filename;
	pointSet.importDate = moment();
	
	Polygon.find({
		'username': req.payload.username
	}).then(function (result) {
		var polygons = result;

		eachSeriesAsync(entries, function (entry, callback) {
		
	//      code for queueing service
	//		data = gr.geocode(entry.address);

			gr.asyncGeocode(entry.address)
				.then(function(data) {
					var point = new Point({
						address: entry.address,
						coordinates: {
							latitude: data.latitude,
							longitude: data.longitude
						},
						placeId: data.extra.googlePlaceId,
						formattedAddress: data.formattedAddress
					});
					point.save(function (err) {});
					polygons.some(function(polygon) {
						var formattedPolygon = [];
						polygon.coordinates.forEach(function(coordinate) {
							formattedPolygon.push([coordinate.latitude, coordinate.longitude]);
						});
						if(inside([point.coordinates.latitude, point.coordinates.longitude], formattedPolygon)) {
							point.polygon = polygon;
						};
						return point.polygon === polygon;
					});
					pointSet.points.push(point);
					if (pointSet.points.length === entries.length) {
						pointSet.save(function (err) { /*console.log(err);*/ });
						return res.status(200).json(pointSet);
					};
				}, function(err) {
					console.log(err)
				});

			callback();
		
		}, function(err, data) {
			if (err) {
				/*console.log('Error');*/
			} else {
				console.log('All done');
			}
		});
		
	}, function (err) {
		console.log(err);
	});

});

router.post('/correctPoint', auth, function(req, res, next) {
	gr.asyncGeocode(req.body.address)
		.then(function(data){
			var update = {
				$set: {
					address: req.body.address,
					coordinates: {
						latitude: data.latitude,
						longitude: data.longitude
					},
					placeId: data.extra.googlePlaceId,
					formattedAddress: data.formattedAddress
				}
			};
			PointSet.findByIdAndUpdate(req.body._id, update, function(err, data) {
				if (err) {
					console.log(err)
				} else {
					res.json(data);
				}
			});
		});
});

router.post

/* TEST ROUTE: GET pointSets */
router.get('/getPointSets', function(req, res, next) {
	PointSet
		.find()
		.populate('points')
		.exec(function(err, docs) {

			var options = {
				path: 'points.polygon',
				model: 'Polygon'
			};

			if(err){ return callback(err); }
			PointSet.populate(docs, options, function(err, pointsets) {
				if(err) { return callback(err); }
				res.json(pointsets);
			});
	})
});

router.post('/asyncTest', function(req, res, next) {
	gr.asyncGeocode(req.body.address)
		.then(function(data){
			return res.status(200).json(data);
		});
});

module.exports = router;
