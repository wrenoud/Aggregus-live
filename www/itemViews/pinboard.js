define(['tpl!templates/pinboard.tmpl', 'leaflet', 'collectionViews/pins', 'models/pin', 'vent', 'isotope', 'perfectmasonry'], function (pinboard, L, pinsView, pinModel, vent, isotope, perfectmasonry) {
	PinboardView = Backbone.Marionette.ItemView.extend({
		
	template: pinboard,
	
	initialize: function() {
		if (this.model) {
			this.model.set("searchLat", window.searchLat);
			this.model.set("searchLng", window.searchLng);
		}
		$('body').removeClass('nooverflow');
	},
	
	onRender: function() {
		$(document).ready(function() {
			$.ajax({
					url: '/experiences/' + window.searchLat + '/' + window.searchLng,
					type: 'GET'
				}).done(function(data) {

					if (data.length <= 0) {
						alert("We're sorry, but we we're able to find any experiences for the location you requested!");
					}
					else {
						this.pinCollection = Backbone.Collection.extend();
						
						window.pins = new this.pinCollection;
						
						this.pinxpView = new pinsView({collection: window.pins, el: '.pins'});
						
						for (i=0;i < data.length; i++) {
							var pin = new pinModel;
							pin.set(data[i]);
							if (!data[i].hidden || data[i].hidden == false) {
								window.pins.add(pin);
							}
						}
						
							$.ajax({
								url: '/LoginCheck',
								type:'GET',
							}).done(function(data) {
								$.ajax({
								url: '/hearts/' + data,
								type:'GET',
								}).done(function(data) {

									window.hearts = data;
									$.each(window.hearts, function ( index, heart ) {
										$('div[data-id="' + heart.experience.aggid + '"]').removeClass('heart');
										$('div[data-id="' + heart.experience.aggid + '"] i').css('color','#FBBAFC');
									});
								}).fail(function() {
									console.log("heart fail");
								});
							}).fail(function() {
							});
						
						$(function(){
						  $('.pins').isotope({
							itemSelector : '.card',
						  	layoutMode: "perfectMasonry",
							animationEngine: "css"
						  });
						});
					}
				}).fail(function() {
					// ADD FAILSAFE!!
				});
		})
	},
	
	})
	
	return PinboardView;
})