define(['tpl!templates/pin.tmpl','vent'], function (pin, vent) {
	pinView = Backbone.Marionette.ItemView.extend({
		
	template: pin,
	
	events: {
		'click .heart':'createHeart'
	},
	
	createHeart: function() {
		
		var $this = this;
		
		$.ajax({
			url: '/LoginCheck',
			type:'GET',
		}).done(function(data) {
			var heart = {
				aggid: "Heart-" + data + Math.floor((Math.random() + 1) * 10000000),
				creator: data,
				experience: {
					aggid: $this.model.get("aggid"),
					profileimg: $this.model.get("profileimg"),
					name: $this.model.get("name")
				},
				date: new Date()
			};
			
			$.ajax({
			url: '/heart',
			type:'POST',
			data: {
				heart: heart
			}
			}).done(function(data) {
				$('div[data-id="' + $this.model.get("aggid") + '"]').removeClass('heart');
				$('div[data-id="' + $this.model.get("aggid") + '"] i').css('color','#FBBAFC');
			}).fail(function() {
				alert("Could not create heart!");
			});
			
		}).fail(function() {
			alert("You must be logged in to heart an experience.");
			window.portalAction = function() {
				vent.trigger("header:refresh");
				vent.triggeR("pages:pinboard");
			}
			vent.trigger("show:portal");
		});
	},
	
	});
	
	return pinView;
})