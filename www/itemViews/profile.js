define(['tpl!templates/profile.tmpl','vent'], function (profile, vent) {
	NotificationView = Backbone.Marionette.ItemView.extend({
		
	template: profile,
	
	events: {
		'click .createmessage':'createmessage'
	},
	
	initialize: function() {
		this.model.on("change", this.render, this);
	},
	
	onRender: function() {
		
		$this = this;
		
		$(document).ready(function() {
			
			$.ajax({
				url: '/experience/userid/' + $this.model.get("aggid"),
				type: 'GET'
			}).done(function(data) {
					if (data.length == 0) {
						$('.polaroid .experiences').html('<span>This user has not yet created any experiences.</span>');
	
					}
					else {
					$('.polaroid .experiences').html("");
					for (i = 0; i < data.length; i++) {
						$('.polaroid .experiences').append('<div class="experience"><img src="'+data[i].profileimg+'" /><div>'+data[i].name+'<span style="font-size:20px"><a href="/#experience/'+data[i].aggid+'">View Experience</a></span></div></div>');
					}
					}
			}).fail(function() {
				$('.polaroid .experiences').html('Sorry, there was an error fetching the experiences for this user.');
			});
		
			$('body').addClass('nooverflow');
			
			$(".background").bind("load", function () { $(this).css('visibility','visible').hide().fadeIn('slow'); });
	
			var $bg = $('#background');
			var $window = $(window);
			var map = null;
			
			var caps = function(string) {
				  return string.charAt(0).toUpperCase() + string.slice(1);
			  };
			
			$('.polaroid .menu').hoverIntent(function( evt ) {
				$('.polaroid .title').fadeOut('fast');
				$('.polaroid .hovername').fadeIn('fast');
				$('.polaroid .options').animate({
					'display':'inline',
					'width':'309',
			},400)}, function() {
				$('.polaroid .title').fadeIn('fast');
				$('.polaroid .hovername').fadeOut('fast');
				$('.polaroid .hovername span').text(caps($('.polaroid .chosen').data("id")));
				$('.polaroid .options').animate({
					'width':'100',
					'display':'none',
				},300)
			});
			
			$('.menu .options div').hover(function( evt ) {
				$('.footer .title').text(caps($(evt.currentTarget).data("id")));
				$('.polaroid .hovername span').text(caps($(evt.currentTarget).data("id")));
			
			});
			
			var optionClick = function( evt ) {
				
				$('.polaroid .hovername').hide();
				
				$(".polaroid .options div").unbind("click");
				
				var fadeInClass = "." + $(evt.currentTarget).data("id");
				
				$('.polaroid .title').text(caps($(evt.currentTarget).data("id")));
				
				if (evt.currentTarget.className != 'chosen') {
					$('.chosen').removeClass('chosen').addClass('option');
					$(evt.currentTarget).removeClass('option').addClass('chosen');
				}
				
				$('.selected').fadeOut('slow',function() {
						$('.selected').removeClass('selected');
						$(fadeInClass).fadeIn('slow', function () {
							$(".polaroid .options div").bind("click", optionClick);
							console.info("Loaded!");
						$(fadeInClass).addClass('selected', function() {
						});
							
						if (fadeInClass == ".where" && map == null) {
							map = L.map('map').setView([$this.model.get('location').lat, $this.model.get('location').lng], 15);
									L.tileLayer('https://a.tiles.mapbox.com/v3/aggregus.map-keakb9ot/{z}/{x}/{y}.png', {
										maxZoom: 20
									}).addTo(map);
							var marker = L.marker([$this.model.get('location').lat, $this.model.get('location').lng]).addTo(map);
							marker.bindPopup($this.model.get('location').normal).openPopup();
						}
					});
				});
			};
			
			$(".polaroid .options div").bind("click", optionClick);

	});
	
	},
	
	createmessage: function() {
		
		var $this = this;
		
		$.ajax({
			url: '/LoginCheck',
			type: 'GET',
		}).done(function(data) {
			vent.sender = data;
			vent.sendto = $this.model.get("aggid");
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
	}
	
	});
	
	return NotificationView;
})