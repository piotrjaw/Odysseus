var express = require('express');
var router = express.Router();

var passport = require('passport');
var moment = require('moment');
var jwt = require('express-jwt');

var auth = jwt({secret: 'MERKAVA', userProperty: 'payload'});

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Polygon = mongoose.model('Polygon');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

		return res.json({ token: user.generateJWT() });
	});
});

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

router.post('/importPoly', auth, function(req, res, next) {
	if(!req.body) {
		return res.status(400).json({ message: 'Brak danych o obszarach.' });
	}
	
	var entries = Array.prototype.slice.call(req.body.polygons, 0);
	var username = req.payload.username;
	var count = 0;

	var errArr = [];
	
	entries.forEach(function(entry) {
		var poly = new Polygon();

		poly.name = entry.name;
		poly.username = username;
		poly.importDate = moment();
		poly.coordinates = [];

		var coords = entry.coordinates.split(" ");

		coords.forEach(function(coord) {
			var tempPoint = coord.split(",");
			var point = {
				longtitude: tempPoint[0],
				latitude: tempPoint[1],
				altitude: tempPoint[2]
			};
			poly.coordinates.push(point);
		});

		count++;
		
		poly.save(function (err) {
			errArr.push(err);
			if (errArr.length === entries.length)
			{
				return res.status(200).json({ message: 'Wprowadzono dane ' + count + ' obszarów. ' });
			}
		});
	});
});

module.exports = router;
