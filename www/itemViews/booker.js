// BOOKER CALENDAR CODE IS CONTAINED IN LIB/bookerCal.js. This is due to FullCalendar's render function being a BITCH.

define(['tpl!templates/booker.tmpl', 'vent', 'fullcalendar', 'stripe'], function ( booker, vent, fullCalendar, stripe) {
	BookerView = Backbone.Marionette.ItemView.extend({
	  template: booker,
	  
	  events: {
		  'click .close':'closeBooker',
		  'click .goto':'goto',
		  'click .createinvoice':'createInvoice',
		  'change #timeselect':'permitMixedCheck',
		  'submit #payment-form':'submitpayment'
	  },
	  
	  onBeforeRender: function() {
		  //Stripe.setPublishableKey('pk_live_8OslMpaElrcFbR8k2UjbrQaJ');
		  Stripe.setPublishableKey('pk_test_e1Fodi8mARyIGkGGLH8LoFFC');
	  },  
	  
	  closeBooker: function() {
		  vent.trigger('hide:booker');
	  },
	  
	  createInvoice: function() {
		  var attendees = $('.attendeecount').val();
		  var cost = this.model.get("price");
		  var price = attendees * cost; 
		  var fees = parseFloat(Math.round((price * 100)*0.05) / 100).toFixed(2);
		  window.total = parseFloat(Math.round((parseInt(price) + parseFloat(fees)) * 100) / 100).toFixed(2)
		  
		  
		  $('.product div[name="attendees"]').html("x " + attendees);
		  $('.product div[name="price"]').html("$" + price);
		  $('.product div[name="fees"]').html("$" + fees);
		  $('.product div[name="total"]').html("$" + window.total);
	  },
	  
	  permitMixedCheck: function( data ) {
		  var time = data.currentTarget.options[data.currentTarget.options.selectedIndex].value;
		  var attending = window.bookingObj[window.bookdate] ? (window.bookingObj[window.bookdate][time] ?  window.bookingObj[window.bookdate][time] : 0): 0;
		  
		  if (window.secondary.get("permitMixed") == true) {
			  $('.attendeeinject').html('<h1>How many guests?</h1><h4>This experience is for up to '+ this.model.get("attendees").maximum +' guest(s), with a minimum of '+this.model.get("attendees").minimum+'. There are '+(this.model.get("attendees").maximum-attending)+' slots remaining for this time.</h4><input type="number" onkeyup="if(this.value > this.max || this.value < this.min) {this.value = }" min="'+this.model.get("attendees").minimum+'" max="'+(this.model.get("attendees").maximum-attending)+'" value="'+this.model.get("attendees").minimum+'" class="attendeecount" />');
		  }
		  else if (window.secondary.get("permitMixed") == false) {
			  $('.attendeeinject').html('<h1>How many guests?</h1><h4>This experience is for up to '+ this.model.get("attendees").maximum +' guest(s), with a minimum of '+this.model.get("attendees").minimum+'.</h4><input type="number" onkeyup="if(this.value > this.max || this.value < this.min) {this.value = this.min}" min="'+this.model.get("attendees").minimum+'" max="'+(this.model.get("attendees").maximum)+'" value="'+this.model.get("attendees").minimum+'" class="attendeecount" />');
		  }
	  },
	  
	  goto: function( e ) {
		  
		  $this = this;
		  
		  e.preventDefault();
		  
		  var show = $(e.currentTarget).data("show");
		  var hide = $(e.currentTarget).data("hide");
		  
		  if (show == '.dateselect' && window.secondary.get("restrictDates") == true)  {
			  $(hide).fadeOut('slow', function() {
				  $('.modalwindow').animate({
					'height':'250px',
					'margin-top':'-125px'
				}, 200, function(){$(show).fadeIn('slow');});
			});
	  		}
			
		  if (show == '.timeselect') {
			  if (window.bookdate == null) {
				  alert("Please choose a desired date.");
				  return false;
			  }
			  else {
				$('.modalwindow').animate({
					'height':'525px',
					'margin-top':'-245px'
				}, 200);
				
				secondary = window.secondary;
				bookingTable = window.bookingObj;

				
				if (secondary.get("permitMixed") == true) {
					_.each(secondary.get("times"), function(time) {
						if (window.bookingObj[window.bookdate] ? (window.bookingObj[window.bookdate][time] ?  window.bookingObj[window.bookdate][time] : null): null) {
							if (bookingTable[window.bookdate][time] >= $this.model.get("attendees").maximum || (secondary.get("attendees").maximum - bookingTable[window.bookdate][time]) <  secondary.get("attendees").minimum) {
							}
							else {
						
								$('#timeselect').append('<option data-time="'+time+'" value='+time+'>'+window.clock[time*2]+'</option>');
							}
						}
						else {
								$('#timeselect').append('<option data-time="'+time+'" value='+time+'>'+window.clock[time*2]+'</option>');
						}
					});
				}
				
				else if (secondary.get("permitMixed") == false) {
					_.each(secondary.get("times"), function(time) {
						if (_.contains(bookingTable[window.bookdate], time)) {
						}
						else {
							$('#timeselect').append('<option data-time="'+time+'" value='+time+'>'+window.clock[time*2]+'</option>');
						}
					})
				}
			  }
			  next();
			  $('#timeselect').prepend('<option selected="true">Select Time</option>');
		  }
		  
		  function next() {
			  $(hide).fadeOut('slow', function() {
			  $(show).fadeIn('slow');
			});
		  }
		  
		  next();
		  
	  },
	  
	  submitpayment: function( event ) {
		  var $form = $('#payment-form');
		  
		  var stripeResponseHandler = function(status, response) {
			if (status == 200) {
				 var booking = {
					aggid: "Booking-" + window.user.get('aggid') + Math.floor((Math.random() + 1) * 10000000),
					experience: {
						name: window.secondary.get('name'),
						profileimg: window.secondary.get('profileimg'),
						aggid: window.secondary.get('aggid'),
						creator: {
							aggid: window.secondary.get('creator').aggid,
							profileimg: window.secondary.get('creator').profileimg,
							name: {
								first: window.secondary.get('creator').name.first,
								last: window.secondary.get('creator').name.last
							},
							email: window.secondary.get('creator').email
						},
					},
					booker: {
						aggid: window.user.get('aggid'),
							name: {
								first: window.user.get('name').first,
								last: window.user.get('name').last
							},
						profileimg: window.user.get('profileimg'),
						email: window.user.get('email')
					},
					guestInstructions: window.secondary.get('guestInstructions'),
					charged: false,
					token: response,
					confirmed: false,
					attendees: $('.attendeecount').val(),
					dateCreated: new Date(),
					dateBooked: {
						time: $('#timeselect').val(),
						date: window.bookdate
					},
					dateUpdated: null,
					totalPrice: window.total,
					hostProfit: (window.secondary.get('price') * $('.attendeecount').val()) * 0.95
				};
				
		  	$.ajax({
				url: '/booking',
				type: 'POST',
				data: {
					booking: booking
				}
			}).done(function() {
				alert("Successful! Your host will confirm or decline your date soon - and be sure to check your email for the confirmation notice!");
				var notif = {
					  aggid: "notif" + (new Date).getTime() + Math.floor((Math.random() + 1) * 5000),
					  type: "booking.host",
					  action: null,
					  experience: {
						  name: window.secondary.get('name'),
						  aggid: window.secondary.get('aggid')
					  },
					  recipient: window.secondary.get('creator').aggid,
					  origin: {
						  aggid: window.user.get("aggid"),
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
				vent.trigger("hide:booker");
			}).fail(function() {
				alert("We're sorry, there was a problem completing this booking. We are deeply ashamed...");
			});
		  }
		  else {
			alert("Card declined! Please try again."); 
			$form.find('button').prop('disabled', false); 
		  }
		  }
		  
		  $form.find('button').prop('disabled', true);
	  
		  Stripe.createToken($form, stripeResponseHandler);	  
	  
		  return false;
	  }
	  
	});
	
	return BookerView
	
});
