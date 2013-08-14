define([], function() {

var NotificationModel = Backbone.Model.extend ({
	
	defaults: {
	  aggid: null,
	  type: null,
	  action: null,
	  experience: {
		  name: null,
		  aggid: null
	  },
	  recipient: null,
	  origin: {
		  aggid: null,
		  name: {
			  first: null,
			  last: null
		  },
		  profileimg: null
	  },
	  dateCreated: null
	}
	
});

	return NotificationModel;

});// JavaScript Document