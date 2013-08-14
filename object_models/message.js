module.exports = function(mongoose, email, User) {
	
	var MessageSchema = new mongoose.Schema({
	  aggid: {type: String},
	  subject: {type: String},
	  sender: {
		  name: {
			  first: {type: String},
			  last: {type: String},
		  },
		  aggid: {type: String},
		  profileimg: {type: String}
	  },
	  recipient: {type: String},
	  content: {type: String},
	  dateSent: {type: String}
  	});	
	
	var Message = mongoose.model('Message', MessageSchema);
	
	var get = function(aggid, callback) {
		Message.find({recipient: aggid}, function(err, doc) {
			if (err) {
				callback(500);
			}
			else if (doc) {
				callback(200, doc);
			}
		});
	};
		
	var getById = function(messageid, callback) {
		Message.findOne({aggid: messageid}, function(err, doc) {
			if (err) {
				console.log(err);
				callback(500);
			}
			else if (doc) {
				callback(200, doc);
			}
		});
	};
	
	var create = function(message, callback) {
		var msg = new Message(message);
		
		msg.save(function( err ) {
			if (err) {
				console.log(err);
				callback(500);
			}
			else {
				User.findOne({aggid: message.recipient}, function( fill, user ) {
					email.messageReceived(message, user);
					callback(200);
				})
			}
		});
	};
	
	var del = function(message, callback) {
		Message.remove({aggid: message}, function( err ) {
			if ( err ) {
				callback( 500 );
			}
			else {
				callback( 200 );
			}
		});
	};
	
	return {
	  get: get,
	  del: del,
	  getById: getById,
	  create: create,
	  Message: Message
	  }
	
}