var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: { type : String },
	password: { type : String },
	email: { type : String }
});

mongoose.model('User', UserSchema);