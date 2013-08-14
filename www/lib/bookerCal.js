define(['fullcalendar'], function(fullcalendar) {
	var initBookerCal = function() {
		$('.modalcover').fadeIn("slow");
		  $('.modalwindow').fadeIn("slow", function() {
			$.ajax({
				url: '/bookings/check/' + window.secondary.get("aggid"),
				type: 'GET'
			}).done(function(bookingData) {

			$(document).ready(function() {
				
				window.datesDeny = [];
				window.bookingObj = {};
				
				secondary = window.secondary;
				bookingTable = window.bookingObj;
				datesDeny = window.datesDeny;
				if (secondary.get("permitMixed") == true) {
					
					_.each(bookingData, function(booking) {
						date = booking.dateBooked.date;
						time = booking.dateBooked.time;
						people = booking.attendees;
						
						if (!bookingTable[date]) { bookingTable[date] = {}; }
						
						if (!bookingTable[date][time]) {
							bookingTable[date][time] = people;
						}
						else {
							bookingTable[date][time] = bookingTable[date][time] + people;
						}
						
						if (bookingTable[date][time] > secondary.get("attendees").maximum || secondary.get("attendees").maximum - bookingTable[date][time] < secondary.get("attendees").minimum) {
							if (_.size(bookingTable[date]) >= _.size(secondary.get("times")) && _.every(bookingTable[date], function(attend) {return attend > secondary.get("attendees").maximum || secondary.get("attendees").maximum - attend < secondary.get("attendees").minimum})) {
								datesDeny.push(date);
							}
						}
					});
				
				}
				
				else if (secondary.get("permitMixed") == false) {
					
					_.each(bookingData, function(booking) {
						date = booking.dateBooked.date;
						time = booking.dateBooked.time;
						people = booking.attendees;
						
						if (!bookingTable[date]) { bookingTable[date] = {}; }
						
						if (!bookingTable[date][time]) {
							bookingTable[date][time] = people;
						}
						else {
							bookingTable[date][time] = bookingTable[date][time] + people;
						}
						
						if (_.size(bookingTable[date]) >= _.size(secondary.get("times"))) {
							datesDeny.push(date);
						}
					});
					
				}
				
				window.bookdate = null;
				
				if (secondary.get("restrictDates") == false) {
				
				var d = new Date();
				var curr_date = d.getDate();
				var curr_month = d.getMonth() + 1;
				if (curr_month.toString().length <= 1) {
					curr_month = "0" + curr_month;
				}
				if (curr_date.toString().length <= 1) {
					curr_date = "0" + curr_date;
				}
				var curr_year = d.getFullYear();
				var today = curr_year + "-" + curr_month + "-" + curr_date;
				
				$('.calendar').fullCalendar({
					dayClick: function( date, allDay, jsEvent, view ) {
						
						var date = jsEvent.currentTarget.dataset.date;
						var booked = $('td[data-date="' + date + '"]').data("absno");
						
						if (booked != "true") {
							if (today < date) {
								window.bookdate = date;
								updateColors();
								$('.bgblue').removeClass('bgblue');
								$('td[data-date="' + date + '"]').addClass('bgblue');
							}
							else {
								alert("Please select a date in the future.");
							}
						}
					}
				});
				
				var restricted = window.secondary.get("restrictDates");
				if (restricted) {
					$('.fc-day').addClass('dateUnavailable')
				}	
				
				var updateColors = function() {
					
				var restricted = window.secondary.get("restrictDates");
				if (restricted) {
					$('.fc-day').addClass('dateUnavailable')
				}
					
				_.each(window.secondary.get('dates').absyes, function ( yesdate ) {
					 if (today < yesdate) {
					 	$('td[data-date="' + yesdate + '"]').addClass('dateAvailable');
						$('td[data-date="' + yesdate + '"]').data("absyes",'true');
					 }
				});
				_.each(window.secondary.get('dates').absno, function ( nodate ) {
					if (today < nodate) {
					   $('td[data-date="' + nodate + '"]').addClass('dateUnavailable');
					   $('td[data-date="' + nodate + '"]').data("absno",'true');
					}
				});
				
				_.each(window.datesDeny, function ( nodate ) {
					console.log(nodate + "NBO");
					if (today < nodate) {
					   $('td[data-date="' + nodate + '"]').addClass('dateUnavailable');
					   $('td[data-date="' + nodate + '"]').data("absno",'true');
					}
				});
				
				$('td[data-date="' + window.bookdate + '"]').addClass('bgblue');
				};
				
			  $('.fc-button-prev').click(function() {
				  updateColors();
			  });
			  
			  $('.fc-button-next').click(function() {
				  updateColors();
			  });
			  
			  $('.fc-button-today').click(function() {
				 updateColors();
			  });
			  
			  updateColors();
			}
			
			else if (secondary.get("restrictDates") == true) {
				
				$('.colorMeaning').hide();
				$('#calendar').hide();
				$('.modalwindow').animate({
					'height':'250px',
					'margin-top':'-125px'
				}, 200);
				
				var restrictDates = window.secondary.get("dates").absyes;
				
				$(".restrictDateHolder").append("<select class='restrictDateSel'></select>");
				_.each(restrictDates, function(date) {
				$(".restrictDateSel").append('<option data-date="'+date+'">'+date+'</option>');
				});
				$(".restrictDateSel").prepend('<option data-date="null">Select A Date</option>');
				
				$(".restrictDateSel").change(function(data) {
					var date = data.currentTarget.options[data.currentTarget.options.selectedIndex].value;
					console.log(date);
					if (date == "null") {date = null}
					window.bookdate = date;
				});
			}
			
				});
			});
		});
	};
	return initBookerCal
});