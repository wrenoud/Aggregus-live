// Load central Deps

var express = require('express');
var crypto = require('crypto');
var jade = require('jade');
var underscore = require('underscore');
var mongoose = require('mongoose');
var mandrill = require('node-mandrill')('0bFNPDenlDiZtu7aXujDQQ');
var MemoryStore = require('connect').session.MemoryStore;
var fs = require('fs');
var querystring = require('querystring');

// All the secrets we don't want on git
var secrets = require('./secrets.js')('dev');

// Configure Stripe

var Stripe = require('stripe')(secrets.stripe_api_key);

// Hello there, gorgeous.

var app = express(); 
  
// Tell our Express app how to handle itself.

app.configure(function() {
	app.set('view engine', jade);
	app.use(express.compress()); 
	app.use(express.static(__dirname + '/www'));
	app.use(express.bodyParser());
	app.use(express.cookieParser()); 
	app.use(express.cookieSession({ 
		secret: secrets.session_salt,
		cookie :{ path: '/', httpOnly: true, maxAge: 2*60*60*1000}
	}));
});

app.configure('production', function() {
	app.use(function (req, res, next) {
	  res.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');
	
	  if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(301, 'https://' + req.headers.host + '/');
	  }
	
	  next();
	})
});

// Mongoose Connection

var db = mongoose.connection;

db.on('disconnected', function() {
	mongoose.connect(secrets.dbURI, {server:{auto_reconnect:true}});
});

db.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

mongoose.connect(secrets.dbURI, {server:{auto_reconnect:true}});

// Email Module

var email = require('./object_models/email')(mandrill);

// Mongoose Object Models

var User = require('./object_models/user')(mongoose, email);
var Notifications = require('./object_models/notification')(mongoose, email);
var Experience = require('./object_models/experience')(mongoose, email);
var Booking = require('./object_models/booking')(mongoose, email);
var Review = require('./object_models/review')(mongoose, email);
var Heart = require('./object_models/heart')(mongoose, email);
var Message = require('./object_models/message')(mongoose, email, User);

// Bootstrap Call

app.get('/', function(req, res) {
	res.render('../index.jade');
});

// Sharable Experience Call

app.get('/sharexp/:id', function(req, res) {
	Experience.getById(req.params.id, function( status, experience ) {
		if ( status == 200 ) {
			res.render('../experience.jade', experience);
		}
		else {
			res.send(400);
		}
	});
})

// Sharable Account Call

app.get('/shareuser/:id', function(req, res) {
	User.findOne({aggid: req.params.id}, function( status, user ) {
		if (status == 200) {
			res.render('../profile.jade', user);
		}
		else if (status == 400) {
			res.send(400);
		}
		else {
			res.send(500);
		}
  });
})

// Help Call

app.post('/help', function(req, res) {
	
var request = req.body.request;

email.helpRequest(request, function(status) {
	if (status == 200) {
		res.send(200) 
		}
	else {
		res.send(500);
	}
});

});

// Stripe Handlers

app.post('/charge', function(req, res) {
	var token = req.body.token;
	var price = req.body.price;
	
	Stripe.charges.create(
	{
		amount: price,
		currency: 'usd',
		card: token.id
	}, function(err, charge) {
		if (err) {
         console.log(err.message);
         res.send(400);
		 return;
      }
	  res.send(200);
	})
});

// Terms Requests

app.get('/terms', function(req, res) {
	res.render('../terms.jade');
});

app.get('/static/terms', function(req, res) {
	fs.readFile(__dirname + '/static/terms.html', 'utf8', function(err, terms){
		if (err) {
			res.send(500);
		}
		else if (terms) {
			res.send(200, terms);
		}
	});
});

// Privacy Requests

app.get('/privacy', function(req, res) {
	fs.readFile(__dirname + '/static/privacy.html', 'utf8', function(err, terms){
		if (err) {
			res.send(500);
		}
		else if (terms) {
			res.send(200, terms);
		}
	});
});

// Refunds Requests

app.get('/refunds', function(req, res) {
	fs.readFile(__dirname + '/static/refunds.html', 'utf8', function(err, terms){
		if (err) {
			res.send(500);
		}
		else if (terms) {
			res.send(200, terms);
		}
	});
});

// Learn More Requests

app.get('/learnmore', function(req, res) {
	fs.readFile(__dirname + '/static/learnmore.html', 'utf8', function(err, info){
		if (err) {
			res.send(500);
		}
		else if (info) {
			res.send(200, info);
		}
	});
});

// Login/Logout API

app.post('/login', function(req, res) {
	
	var creds = req.body.creds;

	User.login(creds, function( status, user ) { 
		if (status == 200) {
			req.session.loggedIn = true;
			req.session.aggid = user.aggid;
			res.send(user.aggid);
		}
		else if (status == 500) {
			res.send(500);
		}
		else if (status == 401) {
			res.send(401);
		}
	}); 

});

app.get('/logincheck', function(req, res) {
	if (req.session.loggedIn == true) {
		res.send(200, req.session.aggid);	
	}
	else {
		res.send(401);
	}
});

app.get('/logout', function(req, res) { 
	req.session.loggedIn = false;
	req.session.aggid = null;
	res.send(200);
});

// Registration API

app.post('/register', function(req,res) {
	var user = req.body.user;
	
	User.register(user, function( status ) {
		if (status == 200) {
			req.session.loggedIn = true;
			req.session.aggid = user.aggid;
			res.send(200);
		}
		else if (status == 409) {
			res.send( 409 );
		}
		else {
			res.send( 500 );
		}
	});
});

// Account Confirmation API

app.get('/confirm/:aggid/:code', function(req, res) {
	User.confirm(req.params.aggid, req.params.code, function ( status ) {
		if ( status == 200 ) {
			req.session.loggedIn = true;
			req.session.aggid = req.params.aggid;
			res.send(200);
		}
		else if ( status == 401) {
			res.send(401);
		}
		else {
			res.send(500);
		}
	});
});

// Forgot and Reset Password API

app.post('/forgotpassword', function(req, res) {
	var email = req.body.email;
	User.forgotpassword(email, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	})
});

app.post('/resetpassword', function(req, res) {
	User.resetpassword(req.session.aggid, req.body.password, function ( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send( 500 );
		}
	})
});
	
app.get('/resetpassword/:aggid/:code', function(req, res) {
	User.resetpasswordcheck(req.params.aggid, req.params.code, function( status ) {
		if ( status == 200 ) {
			req.session.aggid = req.params.aggid;
			req.session.loggedIn = true;
			res.send(200, req.session.aggid);
		}
		else {
			res.send(401);
		}
	})
});

app.post('/changepassword', function(req, res) {
	var password = req.body.password;
	User.changepassword(password, req.session.aggid, function( status ) {
		res.send(status);
	});
});

// Heart API

app.get('/hearts/:id', function(req, res) {
	var user = req.params.id;
	
	Heart.getByUserId(user, function( status, hearts ) {
		if ( status == 200 ) {
			res.send(200, hearts);
		}
		else {
			res.send(401);
		}
	});
});

app.delete('/heart/:id', function(req, res) {
	var heart = req.params.id;
	
	Heart.del(heart, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	});
	
});

app.post('/heart', function(req, res) {
	var heart = req.body.heart;

	Heart.create(heart, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	});
});
	
// Account Handling API

app.get('/accounts/:id', function(req, res) { 

	var query = {
		aggid: req.params.id == 'me' ? req.session.aggid : req.params.id
	}
	
	User.findOne(query, function( status, user ) {
		if (status == 200) {
			res.send(200, user);
		}
		else if (status == 400) {
			res.send(400);
		}
		else {
			res.send(500);
		}
  });
});

app.get('/shareuser/:userid/accounts/:id', function(req, res) { 

	var query = {
		aggid: req.params.id == 'me' ? req.session.aggid : req.params.id
	}
	
	User.findOne(query, function( status, user ) {
		if (status == 200) {
			res.send(200, user);
		}
		else if (status == 400) {
			res.send(400);
		}
		else {
			res.send(500);
		}
  });
});

app.get('/accounts/fbid/:id', function(req, res) { 
	
	User.loginByFBID(req.params.id, function( status, user ) {
		if (status == 200) {
			req.session.loggedIn = true;
			req.session.aggid = user;
			res.send(200, user);
		}
		else if (status == 401) {
			res.send(401);
		}
		else {
			res.send(500);
		}
  });
});

app.get('/foo', function(req, res) {
	console.log(req.body);
	console.log(req.query);
});

app.put('/accounts', function(req, res) {
	var data = req.body.update;
	User.updateById(req.session.aggid, data, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	});
});

app.put('/account/email', function(req, res) {	
	var data = req.body.update;
	User.updateById(req.session.aggid, data, function( status ) {
		if ( status == 200 ) {
			res.send(200);
			User.findOne({aggid: req.session.aggid}, function( status, doc) {
				email.welcome(doc);
			});
		}
		else {
			res.send(500);
		}
	});
	
});

app.post('/updateBank', function(req, res) {
	
	var user = req.body.update;
	
	Stripe.recipients.create(user, function(err, recipient) {
		if (err) {
         console.log(err.message);
         res.send(500);
		 return;
      }
	  else {
		  User.updateById(req.session.aggid, {bankacct: recipient}, function( status ) {
			if ( status == 200 ) {
				res.send(200);
			}
			else {
				res.send(500);
			}
		  });
	  }
	})
});

// Notification API

app.post('/notifications', function(req, res) {
	Notifications.create(req.body.notification, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	});
});

app.get('/notifications/:id', function(req, res) {
	Notifications.get(req.params.id, function(status, notifs) {
		if (status == 200) {
			res.send(200, notifs);
		}
		else {
			res.send(500);
		}
	}); 
});

app.delete('/notifications/:id', function(req, res) {
	Notifications.del(req.params.id, function( status ) {
		if (status == 200) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	}); 
});

// Booking API

app.get('/bookings/:id', function(req, res) {
	Booking.getByUserId(req.params.id, function( status, booking ) {
		if ( status = 200 ) {
			res.send(200, booking);
		}
		else {
			res.send(404);
		}
	});
});

app.get('/bookings/check/:id', function(req, res) {
	Booking.check(req.params.id, function( status, bookings ) {
		if ( status = 200 ) {
			res.send(200, bookings);
		}
		else {
			res.send(404);
		}
	});
});

app.put('/booking/:id', function(req, res) {
	var data = req.body.data;
	var aggid = req.params.id;
	Booking.updateById(aggid, data, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(404);
		}
	});
});

app.post('/booking', function(req, res) {
	var booking = req.body.booking;
	Booking.create(booking, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(401);
		}
	});
});

app.delete('/booking/:id', function(req, res) {
	Booking.del(req.params.id, function( status ) {
		if (status == 200) {
			res.send(200);
		}
		else {
			res.send(400);
		}
	}); 
});

// Experiences API

app.get('/experience/:id', function(req, res) {
	Experience.getById(req.params.id, function( status, experience ) {
		if ( status == 200 ) {
			res.send(200, experience);
		}
		else {
			res.send(400);
		}
	});
});

app.get('/sharexp/:xpid/experience/:id', function(req, res) {
	Experience.getById(req.params.id, function( status, experience ) {
		if ( status == 200 ) {
			res.send(200, experience);
		}
		else {
			res.send(400);
		}
	});
});

app.get('/experience/userid/:id', function(req, res) {
	Experience.getByUserId(req.params.id, function( status, experience ) {
		if ( status == 200 ) {
			res.send(200, experience);
		}
		else {
			res.send(400);
		}
	});
});

app.put('/experience/userid/:id', function(req, res) {
	Experience.updateByUserId(req.params.id, req.body.update, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(400);
		}
	});
});

app.get('/experiences/:lat/:lng', function(req, res) {
	Experience.get(req.params.lat, req.params.lng, function( status, xps) {
		if ( status == 200 ) {
			res.send(200, xps);
		}
		else {
			res.send(400);
		}
	}); 
});

app.delete('/experience/:id', function(req, res) {
	Experience.del(req.params.id, function( status ) {
		if (status == 200) {
			res.send(200);
		}
		else {
			res.send(400);
		}
	}); 
});

app.put('/experience/:id', function(req, res) {
	var data = req.body.update;
	Experience.updateById(req.params.id, data, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	});
});

app.post('/experience', function(req, res) {
	var experience = req.body.experience;
	Experience.create(experience, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(401);
		}
	});
});

app.post('/sendroster', function(req, res) {
	
	var guests = req.body.guests;
	var user = req.body.user;
	var query = req.body.query;
	
	email.sendRoster(guests, user, query, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	});
});

// Message API

app.get('/message/:id', function(req, res) {
	Message.getById(req.params.id, function( status, message ) {
		if ( status == 200 ) {
			res.send(200, message);
		}
		else {
			res.send(400);
		}
	});
});

app.get('/messages/:id', function(req, res) {
	Message.get(req.params.id, function( status, messages ) {
		if (status == 200) {
			res.send(200, messages);
		}
		else {
			res.send(400);
		}
	}); 
});

app.post('/message', function(req, res) {
	
	Message.create(req.body.message, function( status ) {
		if ( status == 200 ) {
			res.send(200);
		}
		else {
			res.send(400);
		}
	});
});

app.delete('/message/:id', function(req, res) {
	Message.del(req.params.id, function( status ) {
		if (status == 200) {
			res.send(200);
		}
		else {
			res.send(500);
		}
	}); 
});

app.get('*', function(req, res){
  res.render('../index.jade');
});

app.listen(8080);
