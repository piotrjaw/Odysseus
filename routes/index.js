var express = require('express');
var router = express.Router();

var passport = require('passport');
var moment = require('moment');
var jwt = require('express-jwt');

var auth = jwt({secret: 'MERKAVA', userProperty: 'payload'});

var mongoose = require('mongoose');

var functions = require('../functions.js');

var User = mongoose.model('User');
var Polygon = mongoose.model('Polygon');
var PointSet = mongoose.model('PointSet');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password || !req.body.email) {
		return res.status(400).json({message: 'Prosz� wype�ni� wszystkie pola.'});
	}

	var user = new User();

	user.username = req.body.username;
	user.email = req.body.email;
	user.creationDate = moment();

	user.setPassword(req.body.password);

	user.save(function(err) {
		if(err) { return next(err); }

		return res.json({ token: user.generateJWT() });
	});
});

router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Prosz� wype�ni� wszystkie pola.'});
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

router.post('/importPoints', function(req, res, next) {
	if (!req.body.points) { return res.status(400).json({ message: 'Brak danych o punktach.' }) }
	
	var entries = Array.prototype.slice.call(req.body.points, 0);
	
	var errorArray = [];
	
	var pointSet = new PointSet();
	pointSet.username = req.payload.username;
	pointSet.filename = req.filename;
	
	entries.forEach(function(entry) {
		var point = {
			address: entry.address,
			coordinates: []
		};
	});
	
});

module.exports = router;
