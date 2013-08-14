define(['facebook', 'vent'], function(facebook, vent){
  FB.init({
    appId      : window.location.host == 'localhost:8080' ? '359299774170029' : '130080407167506',
    channelUrl : 'https://www.aggregus.com/channel.html'
  });
  
  FB.Event.subscribe('auth.statusChange', function(response) {
  if (response.status === 'connected') {
	  $.ajax({
		  url: '/logincheck',
		  type:'GET'
	  }).fail(function() {
		FB.api('/me?fields=email, cover,picture, id,first_name, last_name, bio, location', function(response) {
		  $.ajax({
			  url: '/accounts/fbid/' + response.id,
			  type:'GET'
		  }).done(function(data) {
			  vent.user = data;
			  Backbone.history.navigate('/dashboard', {trigger: true});
		  }).fail(function() {
				FB.api('/' + response.location.id, function(locresponse) {
					if (!response.email) {
						alert("We're sorry, but we were unable to obtained your email address. We need this to help verify your identity. Please check your Facebook security settings, or create an account with your preferred email address. Sorry about that!");
						return false;
					}
				$.ajax({
					url: '/register', 
					type: 'POST',
					data: {
						  user: {
							  aggid: response.first_name + response.last_name + Math.floor((Math.random() + 1) * 10000000),
							  fbid: response.id,
							  email: response.email,
							  name: {
								  first: response.first_name,
								  last: response.last_name,
							  },
							  password: Math.floor((Math.random() + 1) * 10000000),
							  termsagree: true,
							  emailconfirm: "yes",
							  profileimg: 'https://graph.facebook.com/'+response.id+'/picture?width=250&height=250',
							  profilepick: null,
							  coverimg: 'https://d2qjfe4gq0m6av.cloudfront.net/assets/FacebookDemoCover.jpg',
							  coverpick: null,
							  dateSignup: new Date(),
							  description: response.bio,
							  location: {
								  lat: locresponse.location.latitude,
								  lng: locresponse.location.longitude,
								  normal: locresponse.name
							  }
						  }
					  }
				}).done(function() {
					Backbone.history.navigate('/dashboard', {trigger: true});
				}).fail(function( err ) {
					if (err.status == 409) {
						alert('There is already an account registered with your email. Please login into your account, or click "Forgot Password" if you need assistance logging in.');
						FB.logout(function(response) {
							FB.XFBML.parse();
						});
					}
				});
				});
		  });
		});
    }).done(function(data) {
		// Don't do a damn thing, Facebook. Shut your mouth. Sit there. Stop talking. No one loves you.
	});
  } else if (response.status === 'not_authorized') {
  } else {
  }
  });
}); 
