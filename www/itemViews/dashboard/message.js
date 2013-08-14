define(['tpl!templates/dashboard/message.tmpl','vent'], function (message, vent) {
	MessageView = Backbone.Marionette.ItemView.extend({
		
	template: message,
	
	events: {
		'click .viewmessage':'viewmessage'
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
	
	});
	
	return MessageView;
})