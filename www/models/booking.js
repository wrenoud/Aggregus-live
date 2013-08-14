define([], function() {

var BookingModel = Backbone.Model.extend ({
	
	defaults: {
	  aggid: null,
	  experience: {
		  name: null,
		  profileimg: null,
		  aggid: null,
		  creator: {
			  aggid: null,
			  profileimg: null,
			  name: {
				  first: null,
				  last: null
			  }
		  },
	  },
	  booker: {
		  aggid: null,
			  name: {
				  first: null,
				  last: null
			  },
		  profileimg: null
	  },
	  charged: null,
	  token: null,
	  confirmed: null,
	  attendees: null,
	  guestInstructions: null,
	  dateCreated: null,
	  dateBooked: {
		  time: null,
		  date: null
	  },
	  dateUpdated: null,
	  totalPrice: null,
	  hostProfit: null,
	}
});

	return BookingModel;

});