define(['tpl!templates/index.tmpl', 'vent'], function (index, vent) {
	IndexView = Backbone.Marionette.Layout.extend({
	  
	  template: index,
	  
	  events: {
		  'click #getstartedbtn':'openModal',
		  'click .createheart':'createHeart',
		  'click .searchLocBtn':'searchExp'
	  },
	 
	  openModal: function() {
		  vent.trigger('show:portal');
	  },
	  
onRender: function() {
	
		$this = this;
			  
		$(document).ready(function() {
	

			
			$(".background").bind("load", function () { $($this).css('visibility','visible').hide().fadeIn('slow'); });
			
			var $bg = $('.background');
			var $window = $(window);
			var map = null;
			
			var fitBG = function() {
				if ($bg.height() < $window.height()) {
					$bg.css('height', '100%');
					$bg.css('width', 'auto');
					
				}
				else if ($bg.width() < $window.width()) {
					$bg.css('height', 'auto');
					$bg.css('width', '100%');
				}
			};
			
			$(window).resize(function(){
				fitBG();
			});
			
			

	});
	
	},
	
createHeart: function() {
	
	alert("You must be logged in to heart an experience!");
	window.portalAction = function() {
		vent.trigger("pages:home");
	}
	vent.trigger("show:portal");
},

searchExp: function() {
	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + $('input[name="searchLoc"]').val() + '&sensor=false',
		type: 'GET',
	}).done(function(data) {
		if (!data.results[0]) {
			alert("Sorry, we were unable to locate your homeland!");
		}
		else {
			window.searchLat = data.results[0].geometry.location.lat;
			window.searchLng = data.results[0].geometry.location.lng;
			Backbone.history.navigate('/experiences',{trigger:true});
		}
	}).fail(function() {
		alert("Sorry, we were unable to locate your homeland!");
	});
}
	
	});
	
	return IndexView;
})