define(['tpl!templates/booking.tmpl', 'vent'], function (messenger, vent) {
	BookingView = Backbone.Marionette.ItemView.extend({
		
	template: messenger,
	
	events: {
		'click .bookingClose':'closeBooking'
	},
	
	closeBooking: function() {
		vent.trigger("hide:booking");
	},
	
	});
	
	return BookingView
});