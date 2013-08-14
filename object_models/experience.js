module.exports = function(mongoose, email) {
	
	var ExperienceSchema = new mongoose.Schema({
	  aggid: {type: String},
	  name: {type: String},
	  dateCreated: {type: String},
	  guestInstructions: {type: String},
	  price: {type: Number},
	  description: {type: String},
	  coverimg: {type: String},
	  profileimg: {type: String},
	  creator: {
		  name: {
			  first: {type: String},
			  last: {type: String},
		  },
		  profileimg: {type: String},
		  description: {type: String},
		  aggid: {type: String},
		  location: {
			  normal: {type: String},
			  lat: {type: Number},
		 	  lng: {type: Number}
		  },
		  email: {type: String}
	  },
	  location: {
		  lat: {type: Number},
		  lng: {type: Number},
		  normal: {type: String},
		  range: {type: Number}
	  },
	  attendees: {
		  maximum: {type: Number},
		  minimum: {type: Number},
		  total: {type: Number}
	  },
	  dates: {
		  absyes: {type: Array},
		  absno: {type: Array},
	  },
	  times: {type: Array},
	  duration: {type: Number},
	  permitMixed: {type: Boolean},
	  restrictDates: {type: Boolean},
	  photoURL: {type: String}
  	});	
	
	var Experience = mongoose.model('Experience', ExperienceSchema);
	
	var getById = function(experienceid, callback) {
		Experience.findOne({aggid: experienceid}, function(err, doc) {
			if (err) {
				callback(500);
			}
			else if (doc) {
				callback(200, doc);
			}
			else {
				callback(500);
			}
		});
	};
	
	var getByUserId = function(userid, callback) {
		Experience.find({'creator.aggid': userid}, function(err, doc) {
			if (err) {
				console.log(err);
				callback(500);
			}
			else if (doc) {
				callback(200, doc);
			}
		});
	};
	
	var updateByUserId = function(userid, update, callback) {
		Experience.update({'creator.aggid': userid},{ $set: update }, function(err, doc) {
			if (err) {
				callback(500);
			}
			else {
				callback(200);
			}
		});
	};
	
	var updateById = function (aggid, update, callback) {
		Experience.update(
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
	
	var get = function(lat, lng, callback) {
		
		query = {
			"location.lat": {
					$gt: parseFloat(lat) - .5,
					$lt: parseFloat(lat) + .5,
			},
			"location.lng": {
				$gt: parseFloat(lng) - .5,
				$lt: parseFloat(lng) + .5
			}
		}
		Experience.find({}, function(err, doc) {
			if (err) {
				callback(500);
				console.log(err);
			}
			else if (doc) {
				callback(200, doc);
			}
		});
	};
	
	var del = function(experience, callback) {
		Experience.remove({aggid: experience}, function( err ) {
			if ( err ) {
				console.log( err )
				callback(400);
			}
			else {
				callback(200);
			}
		});
	};
	
	var create = function(experience, callback) {
		var experience = new Experience(experience);
		
		experience.save(function( err ) {
			if (err) {
				callback(500);
			}
			else {
				email.experienceCreated(experience)
				callback(200);
			}
		});
	};
	
	return {
	  Experience: Experience,
	  updateById: updateById,
	  updateByUserId: updateByUserId,
	  get: get,
	  getById: getById,
	  del: del,
	  getByUserId: getByUserId,
	  create: create
	  }
	
}