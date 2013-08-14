define(['tpl!templates/roster.tmpl', 'vent'], function (roster, vent) {
	RosterView = Backbone.Marionette.ItemView.extend({
		
	template: roster,
	
	events: {
		'click .rosterClose':'closeRoster',
		'click .emailroster':'emailRoster'
	},
	
	emailRoster: function() {
		$this = this;
		guests = "";
		
		_.each(window.manageBookingData, function(booking) {	
			if (window.datePicked == booking.dateBooked.date) {
				guests = guests + '<div style="	width:100%;height:75px;padding:20px;border-top: 1px solid #666;"><span style="margin-top:-15px;left:150px;position:absolute;">'+ booking.booker.name.first + " " + booking.booker.name.last + '<br /><a target="_blank" href="/#profile/'+booking.booker.aggid+'">View Profile</a></span><br/>' +
						'<img height="100" width="100" src='+booking.booker.profileimg+' style="margin-top:-30px;position:absolute;"></img></div>';
			}
		});
		
		$.ajax({
			url: '/sendroster',
			type: 'POST',
			data: {
				user: {
					name: {
						first: window.secondary.get("creator").name.first,
						last: window.secondary.get("creator").name.last
					},
					email: window.user.get("email")
				},
				query: {
					date: window.datePicked,
					experience: {
						name: window.secondary.get("name"),
						aggid: window.secondary.get("aggid")
					}
				},
				guests: guests
			}
		}).done(function() {
			alert("Email sent! You should receive it soon!");
		}).fail(function() {
		});
	},
	
	onRender: function() {
	},
	
	closeRoster: function() {
		console.log("foo");
		vent.trigger("hide:roster");
	},
	
	});
	
	return RosterView
});