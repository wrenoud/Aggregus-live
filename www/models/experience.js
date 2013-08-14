define([], function() {

var ExperienceModel = Backbone.Model.extend ({
	
	urlRoot: '/experience',
	
	defaults: {
	  aggid: null,
	  name: null,
	  duration: null,
	  xpperday: null,
	  price: null,
	  description: null,
	  guestInstructions: null,
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
			  normal: null,
			  lat: null,
			  lng: null,
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
	  times: null,
	  permitMixed: null,
	  restrictDates: null,
	  photoURL: null
	}

});

	return ExperienceModel;

});