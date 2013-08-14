module.exports = function(mongoose, email) {
	var crypto = require('crypto');

	var UserSchema = new mongoose.Schema({
	  email: {type: String},
	  aggid: {type: String},
	  fbid: {type: String},
  	  name: {
  	  	first: {type: String},
  	  	last: {type: String},
  	  },
	  password: {type:String},
	  location: {type:String},
	  coverimg: {type:String},
	  coverpick: {type:Object},
	  profileimg: {type:String},
	  profilepick: {type:Object},
	  photoURL: {type: String},
	  dateSignup: {type: String},
	  balanceOwed: {type: Number},
	  termsagree: {type:Boolean},
	  emailconfirm: {type:String},
	  resetpassword: {type:String},
	  location: {
		  lat: {type: Number},
		  lng: {type: Number},
		  normal: {type: String}
	  },
	  description: {type: String},
	  accounttype: {type: String},
	  hearts: {type: Array},
	  social: {
		  facebook: {type: String},
		  twitter: {type: String},
		  pinterest: {type: String},
	  },
	  bankacct: {type: Object}
  	});
	
	var User = mongoose.model('User', UserSchema);
	
	var findOne = function ( query, callback ) {
		User.findOne(query, {password: 0}, function( err,doc ) {
		  	if ( doc ) {
				callback(200, doc);
			}
			else if ( err ) {
				callback(500, null);
				console.log(err);
			}
			else {
				callback(400, null);
			}
		});
	};
	
	var loginByFBID = function (fbid, callback) {
		User.findOne({fbid: fbid}, {password: 0}, function( err,doc ) {
		  	if ( doc ) {
				callback(200, doc.aggid);
			}
			else if ( err ) {
				callback(500, null);
				console.log(err);
			}
			else {
				callback(401, null);
			}
		});
	};
	
	var find = function ( query, callback ) {
		User.find(query, {password: 0}, function(err,doc) {
		  	if (doc) {
				callback(200, doc);
			}
			else if (err) {
				callback(500, null);
				console.log(err);
			}
			else {
				callback(400, null);
			}
		});
	};
	
	var updateById = function (aggid, update, callback) {
		User.update(
			{aggid:aggid}, 
			{
				$set: update,
			}, 
			function(err,doc) {
		  		if (err) {
					callback(500);
					console.log(err);
				}
				else if (doc) {
					callback (200);
				}
				else {
					callback(500);
				}
			});
	};
	
	var confirm = function (aggid, code, callback) {
		User.findOne({aggid: aggid}, function(err, doc) {
			if (!doc) {
				callback(false);
			}
			else if (doc) {
				if (doc.emailconfirm == code) {
					User.update({aggid: aggid}, {emailconfirm: "yes"}, function(err) {
						if (err) {
							callback( 500 );
							console.log(err);
						}
						else {
							callback( 200 );
						}
					})
				}
				else if (doc.emailconfirm != code) {
					callback( 401 );
				}
			}
			else if (err) {
				callback( 500 );
				console.log(err);
			}
		})
	};
	
	var changepassword = function (password, user, callback) {
		var shaSum = crypto.createHash('sha256');
		
		shaSum.update(password.old);
		
		var oldPass = shaSum.digest('hex');

		User.findOne({aggid: user, password: oldPass},function(err,doc) {
			if (doc) {
				
				var shaSum = crypto.createHash('sha256');
				shaSum.update(password.new);
				
				User.update(
				  {aggid: user}, 
				  {
					  $set: {
						  password: shaSum.digest('hex')
					  },
				  }, 
				  function(err,doc) {
					  if (err) {
						  callback(500);
						  console.log(err);
					  }
					  else if (doc) {
						  callback (200);
					  }
					  else {
						  callback(500);
					  }
				  });
			}
			else if (err) {
				callback(500, null);
				console.log(err);
			}
			else {
				callback(401, null);
			}
		})
	};
	
	var forgotpassword = function (useremail, callback) {
		User.findOne({email: useremail}, function(err,doc) {
		  	if (doc) {
				resetPassId = Math.floor((Math.random() * 1000000000000) + 1);
				email.resetPassword(doc, resetPassId);
				User.update({email: useremail}, {resetpassword: resetPassId}, function(err) {
					if (err) {
						callback( 500 );
					}
					else {
						callback( 200 );
					}
				});
			
			}
			else {
				callback(301)
			}
		});
	};
	
	var resetpassword = function(aggid, password, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password); 
		
		User.update({aggid: aggid}, {password: shaSum.digest('hex'), resetpassword: "None Requested"}, function(err) {
					if (err) {
						callback( 500 );
						console.log(err);
					}
					else {
						callback( 200 );
					}
		});
	};
	
	var resetpasswordcheck = function(aggid, code, callback) {
		User.findOne({aggid:aggid}, function(err, doc) {
			if (doc) {
				if (doc.resetpassword == code) {
					callback( 200 );
				}
				else {
					callback( 401 );
				}
			}
			else if (err) {
				callback( 500 );
				console.log(err);
			}
			else {
				callback( 401 );
			}
		})
	};
	
	var login = function (creds, callback) {
		
		var shaSum = crypto.createHash('sha256');
		shaSum.update(creds.password);
		
		User.findOne({email:creds.email, password:shaSum.digest('hex')},function(err,doc) {
			if (doc) {
				callback(200, doc);
			}
			else if (err) {
				callback(500, null);
				console.log(err);
			}
			else {
				callback(401, null);
			}
		})
	};
	
	var register = function(user, callback) {
		User.findOne({email: user.email}, function(err, doc) {
			if (!doc) {
				
			var shaSum = crypto.createHash('sha256');
			shaSum.update(user.password);
			user.password = shaSum.digest('hex');
			
			var newUser = new User(user);
			newUser.save(function (err) {
			  if (err) return handleError(err);
				callback(200);
			})
						
			email.welcome(user);
			
			}
			else if (doc) {
				callback(409)
			}
			else if (err) {
				callback(500)
				console.log(err)
			}
			else {
				callback(500)
			}
		});

	};
	
	return {
	  updateById: updateById,
	  register: register, 
	  login: login,
	  find: find,
	  findOne: findOne,
	  loginByFBID: loginByFBID,
	  confirm: confirm,
	  forgotpassword: forgotpassword,
	  resetpassword: resetpassword, 
	  changepassword: changepassword,
	  resetpasswordcheck: resetpasswordcheck,
	  User: User
	  }
}