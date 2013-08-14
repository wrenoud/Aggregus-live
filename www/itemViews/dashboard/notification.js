define(['tpl!templates/dashboard/notifications/notification.message.tmpl','tpl!templates/dashboard/notifications/notification.message.experience.tmpl','tpl!templates/dashboard/notifications/notification.claim.tmpl','tpl!templates/dashboard/notifications/notification.review.tmpl', 'tpl!templates/dashboard/notifications/notification.booking.host.tmpl','tpl!templates/dashboard/notifications/notification.booking.attendee.tmpl', 'vent'], function (notificationMessage, notificationMessageExperience, notificationClaim, notificationReview, notificationBookingHost, notificationBookingAttendee, vent) {
	NotificationView = Backbone.Marionette.ItemView.extend({
		
	template: notificationMessage,
	
	events: {
		'click .viewprofile':'viewprofile',
		'click .viewmessage':'viewmessage',
		'click .createmessage':'createmessage'
	},
	
	viewprofile: function( e ) {
		e.preventDefault();
		Backbone.history.navigate("profile/" + $(e.currentTarget).data("profileid"), {trigger: true});
	},
	
	createmessage: function( e ) {
		
		var $this = this;
		
		$.ajax({
			url: '/LoginCheck',
			type: 'GET',
		}).done(function(data) {
			vent.sender = data;
			vent.sendto = $(e.currentTarget).data("id");
			vent.trigger('show:messenger');
				$('.modalwindow').animate({
					'height':'450px'
				}, 200, function() {
				$('.messenger').fadeIn('slow')
				});

		}).fail(function() {
			alert("You must be logged in to send a message to this user!")
			// Make something way less dootsy than this!
		});
	},
	
	viewmessage: function( e ) {
		e.preventDefault();
		$.ajax({
			url: '/message/' + $(e.currentTarget).data("messageid"),
			type: 'GET'
		}).done(function (data)  {
			vent.trigger('show:messenger');
			vent.sendto = data.sender.aggid;
			$('.message').fadeIn('slow');
			$('.message .content').html(data.content);
			$('.message .subject').text("Subject: " + data.subject);
			$('.message .deletemessage').data("id", data.aggid);
			$('.message .from').html("Your message from " + data.sender.name.first + ":");
		}).fail(function() {
		});
	},
	
	onBeforeRender: function() {
		
		switch (this.model.get('type')) {
			case 'message':
				this.template = notificationMessage;
				break;
			case 'claim':
				this.template = notificationClaim;
				break;
			case 'booking.host':
				this.template = notificationBookingHost;
				break;
			case 'booking.attendee':
				this.template = notificationBookingAttendee;
				break;
			case 'message.experience':
				this.template = notificationMessageExperience;
				break;
			case 'review':
				this.template = notificationReview;
				break;
		}
	}
	
	
	
	});
	
	return NotificationView;
})