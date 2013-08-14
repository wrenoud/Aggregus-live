module.exports = function(mongoose, email) {
	
	var BookingSchema = new mongoose.Schema({
	  aggid: {type: String},
	  experience: {
		  name: {type: String},
		  profileimg: {type: String},
		  aggid: {type: String},
		  creator: {
			  aggid: {type: String},
			  profileimg: {type: String},
			  name: {
				  first: {type: String},
				  last: {type: String}
			  },
			  email: {type: String}
		  },
	  },
	  booker: {
		  aggid: {type: String},
		  name: {
			  first: {type: String},
			  last: {type: String}
		  },
		  profileimg: {type: String},
		  email: {type: String},
	  },
	  charged: {type: Boolean},
	  token: {type: Object},
	  guestInstructions: {type: String},
	  confirmed: {type: Boolean},
	  attendees: {type: Number},
	  dateCreated: {type: String},
	  dateBooked: {
		  time: {type: String},
		  date: {type: String}
	  },
	  dateUpdated: {type: String},
	  totalPrice: {type: Number},
	  hostProfit: {type: Number}
  	});	
	
	var Booking = mongoose.model('Booking', BookingSchema);
	
	var getByUserId = function(userid, callback) {
		Booking.find( { $or: [ {'booker.aggid': userid}, {"experience.creator.aggid": userid} ] }, function(err, doc) {
			if (err) {
				callback(500);
			}
			else if (doc) {
				callback(200, doc);
			}
		});
	};
	
	var check = function(experience, callback) {
		Booking.find( { $and: [ {'experience.aggid': experience}, {'confirmed': true} ]}, { dateBooked: 1, attendees: 1, booker: 1 }, function(err, doc) {
			if ( err ) {
				callback(500);
			}
			else if (doc) {
				callback(200, doc);
			}
		});
	};
	
	var get = function(callback) {
		Booking.find(function(err, doc) {
			if ( err ) {
				callback(500);
			}
			else if (doc) {
				callback(200, doc);
			}
		});
	};
	
	var updateById = function (aggid, data, callback) {
		Booking.update(
			{aggid:aggid}, 
			{
				$set: data,
			}, 
			function(err,doc) {
		  		if (err) {
					callback(500);
					console.log( err );
				}
				else if (doc) {
					if(data.confirmed) {
						if (data.confirmed == true) {
							Booking.findOne({aggid: aggid}, function(err, doc) {
								if (doc) {
									email.bookingConfirmed(doc);
								}
							});
							
						}
					}
					callback (200);
				}
				else {
					callback(500);
				}
			});
	};
	
	var create = function(booking, callback) {
		var booking = new Booking(booking);
		
		booking.save(function( err ) {
			if (err) {
				callback(500);
			}
			else {
				callback(200);
			}
		});
		email.bookingCreated(booking);
		email.bookingReceived(booking);
	};
	
	var del = function(booking, callback) {
		Booking.remove({aggid: booking}, function( err ) {
			if ( err ) {
				console.log( err )
				callback(400);
			}
			else {
				callback(200);
			}
		});
	};
	
	return {
	  Booking: Booking,
	  getByUserId: getByUserId,
	  updateById: updateById,
	  get: get,
	  del: del,
	  check: check,
	  create: create
	  }
	
}