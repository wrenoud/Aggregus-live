define([], function() {

var AccountModel = Backbone.Model.extend ({
	
	urlRoot: '/accounts',
	
	defaults: {
	  email: null,
	  aggid: null,
  	  name: {
  	  	first: null,
  	  	last: null,
  	  },
	  password: null,
	  location: null,
	  coverimg: null,
	  profileimg: null,
	  photoURL: null,
	  balanceOwed: 0,
	  termsagree: null,
	  emailconfirm: null,
	  resetpassword: null,
	  location: {
		  lat: null,
		  lng: null,
		  normal: null
	  },
	  searchLat: window.searchLat,
	  searchLng: window.searchLng,
	  description: null,
	  accounttype: null,
	  hearts: null,
	  social: {
	  	facebook: null,
		twitter: null,
		pinterest: null
	  }
	}
	
});

	return AccountModel;

});