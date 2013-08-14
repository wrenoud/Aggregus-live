define(['tpl!templates/resetpassword.tmpl', 'vent'], function (resetpassword, vent) {
	ResetPasswordView = Backbone.Marionette.ItemView.extend({
	  template: resetpassword,
	  
	  events: {
			'click #resetpasssubmit':'resetpassword',
			'click #resetpassreturn':'resetpassreturn'
			},
		
		resetpassword: function() {
			
			passwordfirst = $('input[name=resetpassfirst]');
			passwordsecond = $('input[name=resetpasssecond]');
			
			if (((passwordfirst.val() == "Enter New Password") || (passwordfirst.val().length == 0)) || ((passwordsecond.val() == "Repeat Password") || (passwordsecond.val().length == 0))) {
				$("#resetpassworderror").text("Please complete both fields.");
				return false;
			}
			
			if (passwordfirst.val() != passwordsecond.val()) {
				$("#resetpassworderror").text("Please ensure both passwords match");
				return false;
			}
			
			$.ajax({
				  url: '/resetpassword',
				  type:'POST',
				  data: {
					  password: passwordsecond.val()
				  }
			  }).done(function() {
				  $("#resetpassworderror").html("Success! Click <a id='resetpassreturn'>here</a> to return to your dashboard.");
			  }).fail(function() {
				  $("#resetpassworderror").text("There was an error. Please try again in a couple minutes.");
		  })
		},
		
	  resetpassreturn: function() {
		  Backbone.history.navigate('/dashboard', {trigger:true});
	  }
	  
	});
	
	return ResetPasswordView;
})