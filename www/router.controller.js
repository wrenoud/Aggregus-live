define(['vent'], function(vent) { 
	
	function loginCheck(onSuccess, onFail, staticPause) {
		$.ajax({
			url: '/logincheck',
			type:'GET'
		}).done(function(data) {
			vent.user = data;
			vent.trigger("header:login");
			console.log(window.routing == undefined && staticPause == true);
			console.log(window.routing);
			console.log(staticPause);
			window.routing == undefined && staticPause == true ? window.routing = true : vent.trigger(onSuccess);
			console.log(window.routing);
		}).fail(function() {
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					$.ajax({
						url: '/accounts/fbid/' + response.authResponse.userID,
						type:'GET'
					}).done(function(data) {
						vent.user = data;
						vent.routing == undefined && staticPause == true ? console.info("Static Pause") : vent.trigger(onSuccess);
						vent.trigger("header:login");
					}).fail(function() {
						vent.routing == undefined && staticPause == true ? console.info("Static Pause") : vent.trigger(onSuccess);
						vent.trigger("header:logout");
					});
				} else if (response.status === 'not_authorized') {
					  vent.trigger("header:logout");
					  vent.routing == undefined && staticPause == true ? console.info("Static Pause") : vent.trigger(onSuccess);

				} else {
					 vent.trigger("header:logout");
					 vent.routing == undefined && staticPause == true ? console.info("Static Pause") : vent.trigger(onSuccess);

				}
			});
		});
	};
	
	var index = function() {
		loginCheck("pages:dashboard", "pages:index", false);
	};
	
	var dashboard = function() {
		loginCheck("pages:dashboard", "pages:index", false);
	};
	
	var confirmaccount = function(confirmaccount, code) {
		$.ajax({
			url: 'confirm/' + confirmaccount + '/' + code,
			type: 'GET',
		}).done(function(data) {
			vent.user = data;
			loginCheck("pages:confirmaccount", "pages:confirmaccount", false);
		}).fail(function() {
			alert("Sorry, that confirmation code is invalid.");
			loginCheck("pages:index", "pages:index", false);
		});
	};
	
	var resetpassword = function(resetaccount, code) {
		$.ajax({
			url: 'resetpassword/' + resetaccount + '/' + code,
			type: 'GET',
		}).done(function(data)  {
			loginCheck('pages:resetpassword','pages:resetpassword', false);
		}).fail(function() {
			alert("Sorry, that reset code is invalid.");
			loginCheck("pages:index", "pages:index", false);
		});
	};
	
	var profile = function(profileid) {
		console.log(vent.routing);
		$.ajax({
			url:'accounts/' + profileid,
			type: 'GET'
		}).done(function() {
			vent.profileid = profileid;
			loginCheck("pages:profile", "pages:profile", false);
		}).fail(function() {
			alert("Sorry, that profile does not exist!");
			loginCheck("pages:dashboard","pages:index", false);
		});
	};
	
	var experience = function(experienceid) {
		
		$.ajax({
			url:'experience/' + experienceid,
			type: 'GET'
		}).done(function() {
			vent.experienceid = experienceid;
			loginCheck("pages:experience", "pages:experience", false);
		}).fail(function() {
			alert("Sorry, that experience does not exist!");
			loginCheck("pages:dashboard","pages:index", false);
		});
	};
	
	var experiences = function() {
		loginCheck("pages:pinboard", "pages:pinboard", false);
	};
	
	var create = function() {
		loginCheck("pages:createxp", "pages:index", false);
	};
	
	var terms = function() {
		loginCheck("pages:terms", "pages:terms", true);
	};
	
	var privacy = function() {
		loginCheck("pages:privacy", "pages:privacy", false);
	};
	
	var refunds = function() {
		loginCheck("pages:refunds", "pages:refunds", false);
	};
	
	var introduction = function() {
		loginCheck("pages:introduction", "pages:index", false);
	};
	
	var learnmore = function() {
		loginCheck("pages:learnmore", "pages:learnmore", false);
	};

	var defaultRoute = function() {
		loginCheck("pages:dashboard", "pages:index", false);
	};
	
	return {
		index: index,
		profile: profile,
		experience:experience,
		experiences:experiences,
		introduction:introduction,
		confirmaccount: confirmaccount,
		resetpassword: resetpassword,
		create: create,
		dashboard: dashboard,
		terms: terms,
		privacy: privacy,
		refunds: refunds,
		learnmore: learnmore,
		defaultRoute: defaultRoute
	};
});