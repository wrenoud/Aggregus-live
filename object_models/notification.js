module.exports = function(mongoose, email) {
	
	var NotificationSchema = new mongoose.Schema({
	  aggid: {type: String},
	  type: {type: String},
	  action: {type: String},
	  experience: {
		  name: {type: String},
		  aggid: {type: String}
	  },
	  recipient: {type: String},
	  origin: {
		  aggid: {type: String},
		  name: {
			  first: {type: String},
			  last: {type: String}
		  },
		  profileimg: {type: String}
	  },
	  dateCreated: {type: String},
  	});	
	
	var Notification = mongoose.model('Notification', NotificationSchema);
	
	var get = function(aggid, callback) {
		Notification.find({recipient: aggid}, function(err, doc) {
			if (doc) {
				callback(200, doc)
			}
			if (err) {
				callback(500)
			}
		});
	};
	
	var create = function(notification, callback) {
		
		var notif = new Notification(notification);
		
		notif.save(function() {
			callback( 200 );
		});
	};
	
	var del = function(notification, callback) {
		Notification.remove({aggid: notification}, function( e ) {
			if ( e ) {
				callback(500);
			}
			else {
				callback(200);
			}
		});
	};
	
	return {
	  Notification: Notification,
	  create: create,
	  get: get,
	  del: del
	  }
	
}