define([], function() {

var HeartModel = Backbone.Model.extend ({
	
	defaults: {
	aggid: null,
	  creator: null,
	  experience: {
		  profileimg: null,
		  name: null,
		  aggid: null
	  },
	  date: null
	}
});

	return HeartModel;

});