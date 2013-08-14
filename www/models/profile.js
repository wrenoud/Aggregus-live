define([], function() {

var ProfileModel = Backbone.Model.extend ({
	
	urlRoot: '/accounts',
	
	defaults: {
	  email: null,
	  aggid: null,
  	  firstname: null,
	  lastname: null,
	  location: null,
	  coverimg: null,
	  profileimg: null,
	  photoURL: null,
	  location: {
		  lat: null,
		  lng: null,
		  normal: null
	  },
	  	  searchLat: window.searchLat,
	  searchLng: window.searchLng,
	  description: null,
	  accounttype: null,
	  social: {
	  	facebook: null,
		twitter: null,
		pinterest: null
	  }
	}
	
});

	return ProfileModel;

});