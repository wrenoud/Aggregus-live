define(['tpl!templates/header/header_logout.tmpl', 'vent'], function (header_logout, vent) {
	LogoutView = Backbone.Marionette.ItemView.extend({
	  template: header_logout,
	  
	  events: {
		  'click .login':'openPortal',
		  'click .signup':'openPortal',
		  'click .viewxps':'viewxps'
	  },
	  
	  viewxps: function() {
		  
		  if (window.user.get("location").lat != null && window.user.get("location").lng != null) {
			  window.searchLat = window.user.get("location").lat;
			  window.searchLng = window.user.get("location").lng;
		  }
		  else {
			  window.searchLat = 48.7597;
			  window.searchLng = -122.4869;
		  }
		  
		  console.log(window.searchLat);
		  console.log(window.searchLng);
		  
		  Backbone.history.navigate('/experiences', {trigger: true});
	  
	  },
	  
	  openPortal: function() {
		window.portalAction = function() {
			Backbone.history.navigate('/dashboard', {trigger:true});
		}
		vent.trigger('show:portal');  
	  }
	  
	});
	
	return LogoutView;
	
});