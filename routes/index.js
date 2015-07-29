var express = require('express');
var router = express.Router();

var passport = require('passport');
var moment = require('moment');
var jwt = require('express-jwt');
var async = require('async');

var config = require('../config.json');

var gr = require('../googleRequests.js');

var geocoderProvider = 'google';
var httpAdapter = 'https';

var extra = {
	apiKey: config.googleApiKey,
	formatter: null
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

var auth = jwt({secret: config.secret, userProperty: 'payload'});

var mongoose = require('mongoose');

var Promise = require('bluebird');

var geocodeAsync = Promise.promisify(require('../googleRequests.js').geocode);
var eachSeriesAsync = Promise.promisify(require('async').eachSeries);

var User = mongoose.model('User');
var Polygon = mongoose.model('Polygon');
var PointSet = mongoose.model('PointSet');

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
	
	var data = null;

	eachSeriesAsync(entries, function (entry, callback) {
	
//      code for queueing service
//		data = gr.geocode(entry.address);

		geocoder.geocode(entry.address)
			.then(function(data) {
				var point = {
					address: entry.address,
					coordinates: {
						longitude: data[0].longitude,
						latitude: data[0].latitude
					},
					placeId: data[0].extra.googlePlaceId,
					formattedAddress: data[0].formattedAddress
				};
				pointSet.points.push(point);
				if (pointSet.points.length === entries.length) {
					pointSet.save(function (err) { /*console.log(err);*/ });
					return res.status(200).json(pointSet);
				}
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
});

module.exports = router;
