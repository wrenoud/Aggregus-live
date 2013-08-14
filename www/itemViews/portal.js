define(['tpl!templates/portal.tmpl', 'vent'], function (portal, vent) {
	PortalView = Backbone.Marionette.ItemView.extend({
	  template: portal,
	  
	  events: {
		  'click #signupsubmit':'signup',
		  'click #loginsubmit':'login',
		  'click .forgotpasswordbtn':'openforgotpassword',
		  'click #forgotpasssubmit':'forgotpassword',
		  'click .close':'closemodal',
		  'click #fpnevermind':'closeforgotpassword'
	  },
	  
	  initialize: function(){
		  FB.XFBML.parse();
	  },
	  
	  onRender: function() {
		  FB.XFBML.parse();
	  },
	  
	  closeforgotpassword: function() {
			$('.modalwindow #forgotpassword').fadeOut('slow');
			$('.modalwindow .signup').fadeIn('slow');
			$('.modalwindow .login').fadeIn('slow');
		},	
			
	  closemodal: function() {
			var firstname = $('input[name=signupfname]');
			var lastname = $('input[name=signuplname]');
			var emailS = $('input[name=signupemail]');
			var passwordL = $('input[name=signuppass]');
			var emailL = $('input[name=loginemail]');
			var passwordS = $('input[name=loginpass]');
			var termsagree=  $('input[name=signuplegal]');
			lastname.val("Last Name");
			emailL.val("Email");
			emailS.val("Email");
			firstname.val("First Name");
			passwordL.val("Password");
			passwordS.val("Password");
			vent.trigger("hide:portal");
		},
		
		openforgotpassword: function() {
			$('.modalwindow .signup').fadeOut('slow');
			$('.modalwindow .login').fadeOut('slow');
			$('.modalwindow #forgotpassword').fadeIn('slow');
		},
		
		forgotpassword: function() {
			var email = $('input[name=forgotpassemail]');
			
			if ((email.val() == "Email") || (email.val().length == 0)) {
				$("#forgotpasserror").text("Ensure all form fields are complete.");
				return false;
			}
			else {
				$("#forgotpasserror").text("");
			}
			
			console.log(email.val());
			
			$.ajax({
				url:'/forgotpassword',
				type: 'POST',
				data: {
					email: email.val()
				}
			}).done(function() {
				$("#forgotpasserror").text("Success! Please check your email for the reset link.");
			}).fail(function() {
				$("#forgotpasserror").text("There was an error. Please try again shortly.");
			});
		},
		
		signup: function() {
			// Cache variables for efficency.
			var firstname = $('input[name=signupfname]');
			var lastname = $('input[name=signuplname]');
			var email = $('input[name=signupemail]');
			var password = $('input[name=signuppass]');
			var termsagree=  $('input[name=signuplegal]');
			
			// Check for empty fields.
			if (((lastname.val() == "Last Name") || (lastname.val().length == 0)) || ((email.val() == "Email") || (email.val().length == 0)) || ((firstname.val() == "First Name") || (firstname.val().length == 0)) || ((password.val() == "Password") || (password.val().length == 0))) {
				$("#registererror").text("Ensure all form fields are complete.");
				return false;
			}
			else {
				$("#registererror").text("");
			}
			
			var emailCheck = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
			var emailToCheck = email.val();
			
			// Check that there is a valid email.
			
			if (emailToCheck.search(emailCheck) == -1) {
				$("#registererror").text("Sorry, but your email address is invalid.");
				return false;
			}
			
			//Check that the password is of an adequate length.
			
			if (password.val().length <= 5) {
				$("#registererror").text("Sorry, passwords must be a minimum of five characters in length.");
				return false;
			}
			
			// Check that the terms have been agreed to.
			
			if (termsagree.prop("checked") == false) {
				$("#registererror").text("Sorry, but we've got to have you check that you've read our terms and conditions.");
				return false;
			}
			else {
				$("#registererror").text("");
			}
			
			var user = {
				aggid: firstname.val() + lastname.val() + Math.floor((Math.random() + 1) * 10000000),
				email: email.val().toLowerCase(),
				name: {
					first: firstname.val().charAt(0).toUpperCase() + firstname.val().slice(1).toLowerCase(),
					last: lastname.val().charAt(0).toUpperCase() + lastname.val().slice(1).toLowerCase(),
				},
				password: password.val(),
				termsagree: termsagree.prop("checked"),
				emailconfirm: Math.floor((Math.random() + 1) * 10000000),
				profileimg: "https://d2qjfe4gq0m6av.cloudfront.net/assets/DProf01.jpg",
				profilepick: null,
				coverimg: "https://d2qjfe4gq0m6av.cloudfront.net/assets/DCover01.jpg",
				coverpick: null,
				dateSignup: new Date(),
				description: "None... yet!",
				location: {
					lat: 30.6636,
					lng: 104.0667,
					normal: "Pandatopia"
				},
				social: {
					facebook: "",
					twitter: "",
					pinterest: ""
				}
			}
			
			$.ajax({
				url: '/register', 
				type: 'POST',
				data: {
					user: user
				}
			}).done(function( ) {
				lastname.val("Last Name");
				email.val("Email");
				firstname.val("First Name");
				password.val("Password");
				console.log("Registration success. Welcome to Aggregus, console-dweller!");
				Backbone.history.navigate("introduction", {trigger: true});
			}).fail(function( data ) {
				if (data.responseText == "Conflict") {
						$("#registererror").text("Sorry, but that email is already in use.");
					}
					else {
						$("#registererror").text("Sorry, an unexpected error occurred.");
					}
			});
		},
		
		login: function() {
			
			var email = $('input[name=loginemail]');
			var password = $('input[name=loginpass]');
			
			if (((email.val() == "Email") || (email.val().length == 0)) || ((password.val() == "Password") || (password.val().length == 0))) {
				$("#loginerror").text('Ensure all form fields are complete.');
				return false;
			}
			else {
				$("#loginerror").text('');
			}
			
			var creds = {
				email: email.val().toLowerCase(),
				password: password.val()
			};
			
			$.ajax({
				url: '/login',
				type: 'POST',
				data: {
					creds: creds
				}
			}).done(function(data) {
					vent.trigger("hide:portal");
					window.portalAction();
				}).fail(function(data){
					$("#loginerror").text('Incorrect username or password.');
				});		
		}
		
	});
	
	return PortalView;
	
});