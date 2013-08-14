define(['tpl!templates/experience.tmpl', 'leaflet', 'vent'], function (experience, L, vent) {
	NotificationView = Backbone.Marionette.ItemView.extend({
		
	template: experience,
	
	events: {
		'click .buy':'buy',
		'click .hostmessage':'hostmessage'
	},
	
	initialize: function() {
		this.model.on("change", this.render, this);
		$('body').addClass('nooverflow');
	},
	
	buy: function() {
		$.ajax({
			url: '/LoginCheck',
			type:'GET',
		}).done(function() {
			vent.trigger("show:booker");
		}).fail(function() {
			alert("Sorry, you need to be logged in to book an experience!");
			window.portalAction = function() {
				vent.trigger("header:login");
				vent.trigger("show:booker");
			}
			vent.trigger("show:portal");
		});
	},
	
	onRender: function() {
		
		$this = this;
		
		$(document).ready(function() {
			
			$('body').addClass('nooverflow');
			
			$(".background").bind("load", function () { $(this).css('visibility','visible').hide().fadeIn('slow'); });
			if ($this.model.get("creator").aggid != null) {
			$.ajax({
				url: '/accounts/' + $this.model.get("creator").aggid,
				type: 'GET'
			}).done(function(data) {
				
				var fb = data.social.facebook ? '<a href="http://www.facebook.com/'+ data.social.facebook +'" target="_blank"><div class="sharebox"><i style="margin-left:7px;margin-top:-0px;" class="icon-facebook"></i></div></a>' : '';
				var tw = data.social.twitter ? '<a href="http://www.twitter.com/'+ data.social.twitter +'" target="_blank"><div class="sharebox"><i style="margin-left:2px;margin-top:-0px;" class="icon-twitter"></i></div></a>' : '';
				var pt = data.social.pinterest ? '<a href="http://www.pinterest.com/'+ data.social.pinterest +'" target="_blank"><div class="sharebox"><i style="margin-left:2px;margin-top:-1px;" class="icon-pinterest"></i></div></a>' : '';
				
				console.log(fb);
				console.log(tw);
				console.log(pt);
				console.log(data);
				
            	$('.polaroid .host').html('<img src="'+ data.profileimg+'" />' +
				'<div class="hostsocial">' +
					'<a><div class="sharebox hostmessage"><i style="margin-left:0px;margin-top:-1px;" class="icon-envelope"></i></div></a>' + fb + tw + pt +
				'</div>' +
				'<div class="profile">' +
					'<div>' + data.name.first + ' ' + data.name.last + '</div><span>'+ data.location.normal +'</span><div class="bio">' + data.description + '</div>' +
					'<span><a href="#profile/' + data.aggid + '">Learn more about '+ data.name.first + '</a></span>' +
   				'</div>')
			}).fail(function() {
				$('.polaroid .host').append('Sorry, there was an error fetching the information for this host.');
			});
			}
	
			var $bg = $('#background');
			var $window = $(window);
			var map = null;
			
			var caps = function(string) {
				  return string.charAt(0).toUpperCase() + string.slice(1);
			  };	
			  
			$('.polaroid .social').hoverIntent(function( evt ) {
				$('.polaroid .title').fadeOut('fast');
				$('.polaroid .hovername').fadeIn('fast');
				$('.polaroid .social .options').animate({
					'display':'inline',
					'width':'150',
			},400)}, function() {
				$('.polaroid .title').fadeIn('fast');
				$('.polaroid .hovername').fadeOut('fast');
				$('.polaroid .hovername span').text(caps($('.polaroid .chosen').data("id")));
				$('.polaroid .social .options').animate({
					'width':'50',
					'display':'none',
				},300)
			});
			
			$('.polaroid .menu').hoverIntent(function( evt ) {
				$('.polaroid .title').fadeOut('fast');
				$('.polaroid .hovername').fadeIn('fast');
				$('.polaroid .menu .options').animate({
					'display':'inline',
					'width':'309',
			},400)}, function() {
				$('.polaroid .title').fadeIn('fast');
				$('.polaroid .hovername').fadeOut('fast');
				$('.polaroid .hovername span').text(caps($('.polaroid .chosen').data("id")));
				$('.polaroid .menu .options').animate({
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
				
				$(".menu .options div").unbind("click");
				
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
			
			$(".menu .options div").bind("click", optionClick);
			
			
			
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
	
	hostmessage: function() {
		var $this = this;
		
		$.ajax({
			url: '/LoginCheck',
			type: 'GET',
		}).done(function(data) {
			vent.sender = data;
			vent.sendto = $this.model.get("creator").aggid;
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