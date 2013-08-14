define([], function() {

var HeaderModel = Backbone.Model.extend ({
	
	urlRoot: '/accounts',
	
	defaults: {
		loggedIn: false,
		id: null,
		profileimg: null
	}
	
});

	return HeaderModel;

});