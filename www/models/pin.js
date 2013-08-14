define([], function() {

var PinModel = Backbone.Model.extend ({
	
	urlRoot: '/experience',
	
	defaults: {
	  aggid: null,
	  name: null,
	  price: null,
	  description: null,
	  coverimg: null,
	  profileimg: null,
	  creator: {
		  name: {
			  first: null,
			  last: null,
		  },
		  profileimg: null,
		  description: null,
		  aggid: null,
		  location: {
			  normal: null
		  }
	  },
	  location: {
		  lat: null,
		  lng: null,
		  normal: null,
		  range: null
	  },
	  attendees: {
		  maximum: null,
		  minimum: null,
		  total: null
	  },
	  dates: {
		  absyes: null,
		  absno: null,
	  },
	  time: null,
	  photoURL: null
	}

});

	return PinModel;

});