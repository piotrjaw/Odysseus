var express = require('express');
var router = express.Router();

var passport = require('passport');

var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
	User.find(function(err, users) {
		if(err) {return next(err); }

		res.json(users);
	});
});

router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password || !req.body.email) {
		return res.status(400).json({message: 'Proszę wypełnić wszystkie pola'});
	}

	var user = new User();

	user.username = req.body.username;
	user.email = req.body.email;

	user.setPassword(req.body.password);

	user.save(function(err) {
		if(err) { return next(err); }

		return res.json({ token: user.generateJWT() });
	});
});

router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Proszę wypełnić wszystkie pola'});
	}

	passport.authenticate('local', function(err, user, info) {
		if(err){ return next(err); }

		if(user){
			return res.json({ token: user.generateJWT() });
		} else {
			return res.status(401).json(info);
		}
	});
});

module.exports = router;
