define([
'router', 
'vent', 
'itemViews/index', 
'itemViews/header/header_login', 
'itemViews/header/header_logout', 
'itemViews/footer', 
'itemViews/terms', 
'itemViews/privacy', 
'itemViews/refunds', 
'itemViews/learnmore', 
'itemViews/portal', 
'itemViews/resetpassword', 
'itemViews/confirmaccount', 
'itemViews/profile', 
'itemViews/introduction', 
'itemViews/booker', 
'lib/bookerCal',
'itemViews/pinboard', 
'itemViews/createxp', 
'itemViews/editxp', 
'itemViews/messenger', 
'itemViews/booking',
'itemViews/roster', 
'itemViews/experience', 
'itemViews/dashboard/dashboard', 
'models/account', 'models/profile', 
'models/experience', 'fullcalendar'], 
function(
router, 
vent, 
indexView, 
h_loginView, 
h_logoutView, 
footerView, 
termsView,
privacyView, 
refundsView, 
learnmoreView, 
portalView, 
resetPasswordView, 
confirmAccountView, 
profileView, 
introductionView, 
bookerView, 
bookerCal,
pinboardView, 
createXPView, 
editXPView, 
messengerView,
bookingView, 
rosterView,
experienceView, 
dashboardView, 
userModel, 
profileModel, 
experienceModel, 
fullCalendar) {
	
var App = new Marionette.Application();
	
// View Management Helpers
	
var currentMainView = null;
var currentHeaderView = null;
var currentModalView = null;
var currentFooterView = null;

var closeMainView = function() {
	if (currentMainView != null) {
		App.main.close(currentMainView);
	}
};

var closeHeaderView = function() {
	if (currentHeaderView != null) {
		App.header.close(currentHeaderView);
	}
};

var closeModalView = function() {
	if (currentModalView != null) {
		App.modal.close(currentModalView);
	}
};

var closeFooterView = function() {
	if (currentModalView != null) {
		App.modal.close(currentModalView);
	}
};

vent.on('close:main', function() { closeMainView(); });
vent.on('close:header', function() { closeHeaderView(); });
vent.on('close:modal', function() { closeModalView(); });

window.clock =  ["12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM", "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM" ,"8:00 AM" ,"8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",];
window.searchLat = 48.7597;
window.searchLng = -122.4869;

	
// Marionette Regions
	
App.addRegions({
	header: '#header',
	main: '#main',
	modal: '#modal',
	footer: '#footer'
});
	
// Header Rendering

vent.on('header:login', function() {
	if (!window.user || window.user.get("id") != vent.user) {
		window.user = new userModel({id: vent.user});
	}
	
	currentHeaderView = new h_loginView({model: window.user});
	App.header.show(currentHeaderView);
	
	window.user.fetch();
});

vent.on('header:logout', function() {
	currentHeaderView = new h_logoutView();
	App.header.show(currentHeaderView);
});

	
// Page Rendering

function pageRender( page, uri, secondary, ventid  ) {
	if (!window.user || window.user.get("id") != vent.user) {
		window.user = new userModel({id: vent.user});
	}

	closeModalView();
	
	if (ventid != null) {
	
		window.secondary = new secondary({id: ventid});
		
		currentMainView = new page({model: window.secondary});
		App.main.show(currentMainView);	
			
		window.secondary.fetch();	
		
		Backbone.history.navigate( uri + ventid);
	}
	else {
		
		currentMainView = new page({model: window.user});
		App.main.show(currentMainView);	
		
		Backbone.history.navigate( uri );
	
	}
	
	window.user.fetch();
}
	
// Dashboard Rendering	
	
	vent.on('pages:dashboard', function() {
		pageRender( dashboardView, "dashboard", null, null);
	});
	
// Index Rendering	
	
	vent.on('pages:index', function() {
		pageRender( indexView, "index", null, null);
	});
	
// Introduction Rendering

	vent.on('pages:introduction', function() {
		pageRender( introductionView, "introduction", null, null);
	});
	
// Pinboard Rendering

	vent.on('pages:pinboard', function() {
		pageRender( pinboardView, "experiences", null, null);
	});
	
// Terms Rendering

	vent.on('pages:terms', function() {
		pageRender( termsView, "terms", null, null);
	});
	
// Privacy Rendering

	vent.on('pages:privacy', function() {
		pageRender( privacyView, "privacy", null, null);
	});
	
// Refunds Rendering

	vent.on('pages:refunds', function() {
		pageRender( refundsView, "refunds", null, null);
	});
	
// Learn More Rendering

	vent.on('pages:learnmore', function() {
		pageRender( learnmoreView, "learnmore", null, null);
	});
	
// Profile Rendering

	vent.on('pages:profile', function() {
		pageRender( profileView, "profile/", profileModel, vent.profileid);
	});
	
// Experience Rendering

	vent.on('pages:experience', function() {
		pageRender( experienceView, "experience/", experienceModel, vent.experienceid);
	});
	
// Create Experience Rendering

	vent.on('pages:createxp', function() {
		pageRender( createXPView, "create", null, null);
	});	
	
// Confirm Account Rendering

	vent.on('pages:confirmaccount', function() {
		pageRender( confirmAccountView, "confirm", null, null);
	});
	
// Edit Experience Rendering	

	vent.on('pages:editxp', function() {
		pageRender( editXPView, "edit/", experienceModel, vent.editxp);
	});
	
// Reset Password Rendering
	
	vent.on('pages:resetpassword', function () {
		pageRender( resetPasswordView, "resetpassword", null, null);
	});
	
// Footer Logic and Rendering

	vent.on('show:footer', function() {
		currentFooterView = new footerView;
		App.footer.show(currentFooterView);
	});
	
// Portal Logic and Rendering
	
	vent.on('show:portal', function() {
		currentModalView = new portalView();
		App.modal.show(currentModalView);
		$('.modalcover').fadeIn("slow");
		$('.modalwindow').fadeIn("slow");
	});
	
	vent.on('hide:portal', function() {
	   $('.modalcover').fadeOut("slow");
	   $('.modalwindow').fadeOut("slow", function() {
	});
});

// Booker Logic and Rendering
	
	vent.on('show:booker', function() {
		currentModalView = new bookerView({model: window.secondary});
		App.modal.show(currentModalView);
		bookerCal();
	});
	
	vent.on('hide:booker', function() {
	   $('.modalcover').fadeOut("slow");
	   $('.modalwindow').fadeOut("slow", function() {
	   closeModalView();
	});
});

// Messenger Logic and Rendering
	
	vent.on('show:messenger', function() {
		currentModalView = new messengerView;
		App.modal.show(currentModalView);
		$('.modalcover').fadeIn("slow");
		$('.modalwindow').fadeIn("slow");
	});
	
	vent.on('hide:messenger', function() {
	   $('.modalcover').fadeOut("slow");
	   $('.modalwindow').fadeOut("slow", function() {
	   closeModalView();
	});
});

// Booking Logic and Rendering
	
	vent.on('show:booking', function() {
		currentModalView = new bookingView;
		App.modal.show(currentModalView);
		$('.modalcover').fadeIn("slow");
		$('.modalwindow').fadeIn("slow");
	});
	
	vent.on('hide:booking', function() {
	   $('.modalcover').fadeOut("slow");
	   $('.modalwindow').fadeOut("slow", function() {
	   closeModalView();
	});
});

// Roster Logic and Rendering
	
	vent.on('show:roster', function() {
		currentModalView = new rosterView;
		App.modal.show(currentModalView);
		$('.modalcover').fadeIn("slow");
		$('.modalwindow').fadeIn("slow");
	});
	
	vent.on('hide:roster', function() {
	   $('.modalcover').fadeOut("slow");
	   $('.modalwindow').fadeOut("slow", function() {
	   closeModalView();
	});
});


// User Logic 
	
	App.on('initialize:after', function(){
	  Backbone.history.start({pushState: true});
	  vent.trigger("show:footer");
	});
	
	$.ajax({
		url:'/foo',
		type:'GET',
		data: {
			bar: {
				name: 'Ryan'
			}
		}
	})
	
	return App;
});