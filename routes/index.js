var express = require('express');
var router = express.Router();

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

router.post('/users', function(req, res, next) {
	var user = new User(req.body);

	user.save(function(err, post) {
		if(err) {return next(err); }

		res.json(user);
	});
});

module.exports = router;
