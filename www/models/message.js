define([], function() {

var MessageModel = Backbone.Model.extend ({
	
	defaults: {
	aggid: null,
	subject: null,
	sender: {
		  name: {
			  first: null,
			  last: null,
		  },
		  aggid: null,
		  profileimg: null
	  },
	  recipient: null,
	  content: null,
	  dateSent: null
	}
});

	return MessageModel;

});