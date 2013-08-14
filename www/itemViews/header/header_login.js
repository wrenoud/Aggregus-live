define(['tpl!templates/header/header_login.tmpl', 'vent'], function (login, vent) {
	LogoutView = Backbone.Marionette.ItemView.extend({
	  template: login,
	  
	  events: {
		  'click .logout':'logout',
		  'click .submithelp':'submithelp',
		  'click .plzbtn':'help',
		  'click .viewxps':'viewxps'
	  },
	  
	  initialize: function() {
		this.listenTo(this.model, "change", this.render);
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
		  
		  Backbone.history.navigate('/experiences', {trigger: true});
	  
	  },
	  
	  help: function() {
		  $('.help').toggle()
	  },
	  
	  submithelp: function() {
		  
		  $this = this;
		  
		  $('.helpreqimg').show();
		  
		  var question = $('.helpquestion').val();
		  var now = new Date();
		  
		  $.ajax({
			  url: '/help',
			  type: 'POST',
			  data: {
			  	request: {
					userid: $this.model.get("aggid"),
					name: {
						first: $this.model.get("name").first,
						last: $this.model.get("name").last,
					},
					message: question,
					time: now
				}
			  }
			  }).done(function() {
				  alert("Help is on the way!");
				  $('.helpreqimg').hide();
				  $('.helpquestion').val("")
				  $('.help').toggle();
			  }).fail(function() {
				  $('.helpreqimg').hide();
			  	  alert("Message error. Please try again soon!");
			  });
	  },
	  
	  logout: function() {
		  FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
			FB.logout(function(response) {
				$.get('/logout', function(data){
				}).success(function() {
					if (window.user) {window.user = null}
					if (window.secondary) {window.secondary = null};
					FB.XFBML.parse();
					Backbone.history.navigate('/index', {trigger:true});
				});
			});
		   } else {
			   $.get('/logout', function(data){
				}).success(function() {
					if (window.user) {window.user = null}
					if (window.secondary) {window.secondary = null};
					Backbone.history.navigate('/index', {trigger:true});
				});
		  }
		});
	 },
		
  	  close: function() {
	  	this.remove();
      	this.unbind();
		if (this.model) {
		  this.model.unbind("change", this.modelChanged);
		  this.model.destroy;
		}
	  }
	  
	});
	
	return LogoutView;
	
});