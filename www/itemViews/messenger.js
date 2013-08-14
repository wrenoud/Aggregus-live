define(['tpl!templates/messenger.tmpl', 'vent'], function (messenger, vent) {
	NotificationView = Backbone.Marionette.ItemView.extend({
		
	template: messenger,
	
	events: {
		'click .sendmessage':'sendmessage',
		'click .cancelmessage':'cancelmessage',
		'click .close':'closeMessenger',
		'click .cancelmessage':'closeMessenger',
		'click .deletemessage':'deleteMessage',
		'click .replymessage':'replymessage'
	},
	
	closeMessenger: function() {
		vent.trigger("hide:portal");
	},
	
	replymessage: function() {
		$('.message').fadeOut('slow', function() {
			$('.modalwindow').animate({
					'height':'450px'
				}, 200, function() {
				$('.subjectinput').val("RE:" + $('.subject').text() );	
				$('.messenger').fadeIn('slow')
				});
		});
	},
	
	deleteMessage: function( e ) {
		var delConfirm = confirm("Are you sure you want to delete this message?")
			if (delConfirm == true) {
				e.preventDefault();
				$.ajax({
					url: '/message/' + $(e.currentTarget).data("id"),
					type: 'DELETE'
				}).done(function() {
					vent.trigger("hide:messenger");
					$('.msg[data-id="' + $(e.currentTarget).data("id") + '"]').fadeOut('slow');
					if ($('.notification[data-msgid="' + $(e.currentTarget).data("id") + '"]')) {
						$.ajax({
							url: '/notifications/' + $('.notification[data-msgid="' + $(e.currentTarget).data("id") + '"]').data("id"),
							type: 'DELETE'
						}).done(function() {
							$('.notification[data-msgid="' + $(e.currentTarget).data("id") + '"]').fadeOut('slow');
							var remaining = $('.notifcount').text();
							$('.notifcount').text(remaining - 1);
							if ($('.notifcount').text() == 0) {
								$('.notifcount').remove();
								window.notifs.reset();
								$('.notifcol').text("Sorry, no notifications to display!");
							}
						}).fail(function(){
							alert("Doh! There was an error - sorry about that!");
						});
					}
					var remaining = $('.msgcount').text();
					$('.msgcount').text(remaining - 1);
					if ($('.msgcount').text() == 0) {
						$('.msgcount').remove();
						window.notifs.reset();
						$('.messagecol').text("Sorry, no messages to display!");
					}
				}).fail(function(){
					alert("Doh! There was an error - sorry about that!");
				});
			}
	},
	
	sendmessage: function() {

		
		var messageId = "message" + (new Date).getTime() + Math.floor((Math.random() + 1) * 5000);
		
		if ($('.subjectinput').val().length == 0) {
			alert("Please enter a subject.");
			return false;
		}
		
		else if ($('.messageinput').val().length == 0) {
			alert("Please enter a message.");
			return false;
		}
		
		console.log($('.subjectinput').val());
		
		var message = {
			aggid: messageId,
			subject: $('.subjectinput').val(),
			sender: {
				name: {
					first: window.user.get("name").first,
					last: window.user.get("name").last
				},
				aggid: window.user.get("aggid"),
				profileimg: window.user.get("profileimg"),
			},
			recipient: vent.sendto,
			content: $('.messageinput').val(),
			dateSent: new Date,
		};
		
		$.ajax({
			url: '/message',
			type: 'POST',
			data: {
				message:message
			}
		}).done(function() {
			alert("Message sent!");
			vent.trigger("hide:messenger");
			
			var notif = {
			aggid: "notif" + (new Date).getTime() + Math.floor((Math.random() + 1) * 5000),
			type: "message",
			action: messageId,
			experience: {
				name: null,
				aggid: null
			},
			recipient: vent.sendto,
			origin: {
				aggid: vent.sender,
				name: {
					first: window.user.get("name").first,
					last: window.user.get("name").last,
				},
				profileimg: window.user.get("profileimg"),
			},
			dateCreated: (new Date).getTime()
		}; 

		
		$.ajax({
			url: '/notifications',
			type: 'POST',
			data: {
				notification:notif
			}
		}).done(function() {
		}).fail(function() {
		});
	}).fail(function() {
			alert("Sorry, there was an error!");
		});
	},
	
	cancelmessage: function() {
	}
	
	});
	
	return NotificationView;
})