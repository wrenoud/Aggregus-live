define(['tpl!templates/editxp.tmpl','vent', 'fullcalendar', 'leaflet', 'filepicker',], function (editxp, vent, fullcalendar, L, filepicker) {

	EditXPView = Backbone.Marionette.ItemView.extend({
		
	template: editxp,
	
	profileimg: null,
	coverimg: null,
	imgsub: null,
	photoURL: null,
	currentWindow: $('.editxp .basicscol'),
	calendar: false,
	rosterCalendar: false,
	
	events: {
		'click .editxplocation':'updatemap',
		'click .item':'goto',
		'click button[name="profileimageupload"]':'previewProfileImg',
		'click button[name="coverimageupload"]':'previewCoverImg',
		'click .updatexp':'updateExperience',
		'click .addtime':'addtime',
		'click .uploadnewalbum':'uploadnewalbum',
		'click .removetime':'removetime',
		'click .previewAlbumStart':'previewAlbum',
		'click .emailroster':'emailRoster'
	},
	
	initialize: function() {
		this.model.on("change", this.render, this);
		$('body').removeClass('nooverflow');
	},
	
	onRender: function() {
		
		$this = this;
		
		filepicker.setKey('A9lplqyzRNu27ZCOmWrrPz');
		
		$('body').removeClass('nooverflow');
		
		$('.editxp .basicscol').fadeIn('slow', function() {
					$this.editXPMap = L.map('processmap').setView([$this.model.get('location').lat, $this.model.get('location').lng], 15);
					L.tileLayer('https://a.tiles.mapbox.com/v3/aggregus.map-keakb9ot/{z}/{x}/{y}.png', {
					maxZoom: 20
				}).addTo($this.editXPMap);
				var marker = L.marker([$this.model.get('location').lat, $this.model.get('location').lng]).addTo($this.editXPMap);
				marker.bindPopup($this.model.get('location').normal).openPopup();
				$(".editxp .locationentry").val($this.model.get('location').normal)
		});
	
		$('.item').bind('click', 
			function( e ) {
				$('.manageBookingDialog').remove();
				$('.availabilityDialog').remove(); 
				$('.selected').removeClass("selected"); 
				$(e.currentTarget).addClass('selected'); 
				$('.open').fadeOut('slow', 
					function() { 
						$('.open').removeClass('open'); 
						var next = $(e.currentTarget).data("id"); 
						$('.' + next).addClass('open').fadeIn('slow',function() {
							if (next == "availabilitycol"){ 
								$('.manageBookingDialog').remove();
								if ($this.calendar == false) {
								$this.opencal();
								$this.calendar = true;
								}
							}
							if (next == "rostercol"){ 
								if ($this.rosterCalendar == false) {
								$this.openBookingManageCal();
								$this.rosterCalendar = true;
								}
							}  
						}); 
					}) ;
			});
		
		window.timesAvailable = [];
		_.each(this.model.get('times'), function (time) {window.timesAvailable.push(parseFloat(time)) });
		window.timesAvailable = _.sortBy(window.timesAvailable, function( time ) {return parseInt(time)});
	},
	
		previewAlbum: function() {
		var urlCheck = /(?:imgur.com\/a\/)\w{5}(\/*)$/;
		var url = ($('#editxpphotos').val()).match(urlCheck);
		if ( url == null) {
			alert("There's something amiss with your Imgur URL! Try entering it again. Make sure that there are only five characters after the '/a/', and that ");
			return false;
		}
		else {
			$('#editxpphotos').val('http://www.' + url[0])
			$('.previewAlbum').html('<iframe class="imgur-album" width="350" height="337" frameborder="0" src="'+$('#editxpphotos').val()+'/embed"></iframe>')
			$this.photoURL = '<iframe class="imgur-album" width="350" height="337" frameborder="0" src="'+$('#editxpphotos').val()+'/embed"></iframe>';
		}
	},
	
	openBookingManageCal: function() {
		
		var resetCallbacks = function() {
			$('.generateroster').click(function() {
				vent.trigger("show:roster");
				_.each(window.manageBookingData, function(booking) {
					$('.modalwindow').prepend('<h1 style="margin-left:20px;font-weight:300;">Booking Roster for '+window.datePicked+'</h1><br /><button style="margin:-25px 0 20px 20px" class="btn emailroster">Email Me This Roster</button>');
					if (window.datePicked == booking.dateBooked.date) {
						$('.modalwindow').append('<div class="rosterItem"><span style="margin-top:-15px;left:150px;position:absolute;">'+ booking.booker.name.first + " " + booking.booker.name.last + '<br /><a target="_blank" href="/#profile/'+booking.booker.aggid+'">View Profile</a></span><br/>' +
						'<img height="100" width="100" src='+booking.booker.profileimg+' style="margin-top:-30px;position:absolute;"></img></div>');
					}
				});
			});
			
			$('.availablebtn').click(function() {
			});
			
			$('.removebtn').click(function() {
			});
		}
			
		var today = new Date();
	
		$('#bookingCalendar').fullCalendar({
				  dayClick: function( date, allDay, jsEvent, view ) {	
						  var date = jsEvent.currentTarget.dataset.date;
						  window.datePicked = date;
						  $('input[name="editxpdateholder"]').val(date);
						  
						  $('.manageBookingDialog').remove();
						  
						  var offset = $('#bookingCalendar td[data-date="'+date+'"]').offset();
						  offset.left = offset.left - 45;
						  offset.top = offset.top - 200;
						  
						  var selector = '<div class="manageBookingDialog" style="top:'+offset.top+'px;left:'+offset.left+'px;">' + 
						  						'<div class="pointer"></div>' +
												'<div style="color:white;background-color: rgb(136, 236, 255);background-color: rgba(136, 236, 255, 1);" class="generateroster btn btn option">Generate Roster</div>' +
												'<div style="background-color: rgb136, 236, 255);background-color: rgba(136, 236, 255, 1);color:white" class="btn viewbookings option">View Bookings</div>' +
												'<div style="background-color: rgb(136, 236, 255);background-color: rgba(136, 236, 255, 1);color:white" class="btn cancelbookings option">Cancel Bookings</div>' +
												'<div style="text-align:center;font-weight:500;font-family:lato,sans-serif;position:absolute;height:55px;bottom:-1px;width:150px;background-color:white">Choose Desired Action</div>'+
												'</div>'
						  
						  $('body').append(selector);
						  
						  resetCallbacks();
				  }		
			});
			
		$('#bookingCalendar').fullCalendar('render');

		$('#bookingCalendar').ready(function() {
			$.ajax({
				url: '/bookings/check/' + window.secondary.get("aggid"),
				type: 'GET'
			}).done(function(bookingData) {
				window.manageBookingData = bookingData;
				
				_.each(window.manageBookingData, function( booking ) {
					day = booking.dateBooked.date;
					$('td[data-date="' + day + '"]').addClass('dateAvailable');
				});
				
			}).fail(function() {
			});
		});
		
		$('.fc-button-prev').click(function() {
			 $('.manageBookingDialog').remove();
			_.each(window.manageBookingData, function( booking ) {
					day = booking.dateBooked.date;
					$('td[data-date="' + day + '"]').addClass('dateAvailable');
			});
		});
		
		$('.fc-button-next').click(function() {
			 $('.manageBookingDialog').remove();
				_.each(window.manageBookingData, function( booking ) {
					day = booking.dateBooked.date;
					$('td[data-date="' + day + '"]').addClass('dateAvailable');
				});
		});
	},
	
	opencal: function() {
			
		window.datesAvailable = this.model.get('dates').absyes;
		window.datesUnavailable = this.model.get('dates').absno;
		
		var resetCallbacks = function() {
			$('.notavailablebtn').click(function() {
				
				var change = $('input[name="editxpdateholder"]').val();
				
				if (_.contains(window.datesUnavailable, change)) {
					return false;
				}

				if (_.contains(window.datesAvailable, change)) {
					window.datesAvailable = _.without(window.datesAvailable, change);
					console.log("R - DA");
				}
				
				$('.availabilityDialog').remove();
				
				$('td[data-date="' + change + '"]').removeClass('dateAvailable');
				$('td[data-date="' + change + '"]').addClass('dateUnavailable');
				
				window.datesUnavailable.push(change);
				console.log("Added to DU");
			});
			
			$('.availablebtn').click(function() {
				
				var change = $('input[name="editxpdateholder"]').val();
				
				if (_.contains(window.datesAvailable, change)) {
					return false;
				}
				
				if (_.contains(window.datesUnavailable, change)) {
					window.datesUnavailable = _.without(window.datesUnavailable, change);
					console.log("R - DU");
				}
				
				$('.availabilityDialog').remove();
				
				$('td[data-date="' + change + '"]').removeClass('dateUnavailable');
				$('td[data-date="' + change + '"]').addClass('dateAvailable');
				
				window.datesAvailable.push(change);
				console.log("Added to DA");
			});
			
			$('.removebtn').click(function() {
				$('.availabilityDialog').remove();
				
				var change = $('input[name="editxpdateholder"]').val();
				
				if (_.contains(window.datesAvailable, change)) {
					window.datesAvailable = _.without(window.datesAvailable, change);
					console.log("Removed from DA");
				}
				
				if (_.contains(window.datesUnavailable, change)) {
					window.datesUnavailable = _.without(window.datesUnavailable, change);
					console.log("Removed from DU");
					console.log(window.datesUnavailable);
				}
				
				$('td[data-date="' + change + '"]').removeClass('dateUnavailable');
				$('td[data-date="' + change + '"]').removeClass('dateAvailable');
			});
		}

		$('.timeselect').html('');
		$('.timesavailable').html('');
		var duration = parseFloat($('input[name="editxpduration"]').val());
		var day = []; var z = 0; for (i = 0; i <= 23.5; i = i + .5) {day[z] = i;z++};
		
		var listInclude = day;
		
		_.each(window.timesAvailable, function(timeSlot) {$('.timesavailable').append('<li style="margin:3px;"><span>'+$this.clock[timeSlot*2]+'</span><span data-time="'+timeSlot+'" class="removetime">X</span></li>')})
		
		_.each(window.timesAvailable, function(time) {
			for (i = 0; i < duration / .5; i++) {
				listInclude = _.without(listInclude, parseFloat(time) + (i * 0.5));
				listInclude = _.without(listInclude, parseFloat(time) - (i * 0.5));
			}
		});
		
		_.each(listInclude, function ( time ) { $('.timeselect').append('<option value="'+time+'">'+$this.clock[time * 2]+'</option>'); });
			
		var today = new Date();
	
		$('#calendar').fullCalendar({
				  dayClick: function( date, allDay, jsEvent, view ) {
					  if (date > today) {	
						  var date = jsEvent.currentTarget.dataset.date;
						  $('input[name="editxpdateholder"]').val(date);
						  
						  $('.availabilityDialog').remove();
						  
						  var offset = $('#calendar td[data-date="'+date+'"]').offset();
						  offset.left = offset.left - 45;
						  offset.top = offset.top - 200;
						  console.log(offset);
						  
						  var selector = '<div class="availabilityDialog" style="top:'+offset.top+'px;left:'+offset.left+'px;">' + 
						  						'<div class="pointer"></div>' +
												'<div style="color:black;background-color: rgb(46, 204, 113);background-color: rgba(46, 204, 113, 0.75);" class="availablebtn btn option">Available</div>' +
												'<div style="background-color: rgb(255,255,255);background-color: rgba(255,255,255, 0.75);color:black" class="btn removebtn option">Maybe</div>' +
												'<div style="background-color: rgb(190, 190, 190);background-color: rgba(190, 190, 190, 0.2);color:black" class="btn notavailablebtn option">Unavailable</div>' +
												'<div style="text-align:center;font-weight:500;font-family:lato,sans-serif;position:absolute;height:55px;bottom:-1px;width:150px;background-color:white">Select Date Availability</div>'+
												'</div>'
						  
						  $('body').append(selector);
						  
						  resetCallbacks();
						  
					  }
					  else {
						  alert("Please select a date in the future");
					  }
				  }		
			});
			
		$('#calendar').fullCalendar('render');

		$('#calendar').ready(function() {
			
			_.each(window.datesAvailable, function( day ) {
				$('td[data-date="' + day + '"]').addClass('dateAvailable');
			});
			_.each(window.datesUnavailable,function( day ) {
				$('td[data-date="' + day + '"]').addClass('dateUnavailable');
			});
		});
		
		$('.fc-button-prev').click(function() {
			 $('.availabilityDialog').remove();
			window.datesAvailable.forEach(function( day ) {
				$('td[data-date="' + day + '"]').addClass('dateAvailable');
			});
			window.datesUnavailable.forEach(function( day ) {
				$('td[data-date="' + day + '"]').addClass('dateUnavailable');
			});
		});
		
		$('.fc-button-next').click(function() {
			 $('.availabilityDialog').remove();
			window.datesAvailable.forEach(function( day ) {
				$('td[data-date="' + day + '"]').addClass('dateAvailable');
			});
			window.datesUnavailable.forEach(function( day ) {
				$('td[data-date="' + day + '"]').addClass('dateUnavailable');
			});
		});
	},
	
	uploadnewalbum: function() {
		var urlCheck = new RegExp('(imgur.com/a/)\w{5}(\/*)$', g);
		var url = urlCheck.exec($('#editxpphotos').val());
		if ( url == null) {
			alert("There's something amiss with your Imgur URL! Try entering it again. Make sure that there are only five characters after the '/a/', and that it ends without a slash.");
			return false;
		}
		else {
			
			$.ajax({
					url: '/experience/' + $this.model.get("aggid"),
					type: 'PUT',
					data: {
						update: {
							photoURL: "<iframe class='imgur-album' width='350' height='337' frameborder='0' src='https://"+url+"/embed'></iframe>"
						}
					}
				}).done(function() {
					alert("Updated!");
					$this.model.fetch();
				}).fail(function() {
				});
		}
	},
	
	clock:["12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM", "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM" ,"8:00 AM" ,"8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",],
	
	addtime: function() {
		
		$this = this;
		
		var time = parseFloat($('.timeselect').val());
		var duration = parseFloat($('input[name="editxpduration"]').val());
		var day = []; var z = 0; for (i = 0; i <= 23.5; i = i + .5) {day[z] = i;z++};
		
		if (_.contains(window.timesAvailable, time)) {
			return false;
		}
		else {
			
			window.timesAvailable.push(time);
			window.timesAvailable = _.sortBy(window.timesAvailable, function( time ) {return parseInt(time)});
			
			$('.timeselect').html('');
			$('.timesavailable').html('');
			
			_.each(window.timesAvailable, function(timeSlot) {$('.timesavailable').append('<li style="margin:3px;"><span>'+$this.clock[timeSlot*2]+'</span><span data-time="'+timeSlot+'" class="removetime">X</span></li>')});
			
			var listInclude = day;
			
			_.each(window.timesAvailable, function(time) {
				for (i = 0; i < duration / .5; i++) {
					listInclude = _.without(listInclude, parseFloat(time) + (i * 0.5));
					listInclude = _.without(listInclude, parseFloat(time) - (i * 0.5));
				}
			});
			
			_.each(listInclude, function ( time ) { $('.timeselect').append('<option value="'+time+'">'+$this.clock[time * 2]+'</option>'); });
		
		}
	},
	
	onBeforeClose: function() {
		$('.manageBookingDialog').remove();
		$('.availabilityDialog').remove();
	},
	
	removetime: function( e ) {
		$this = this;
		
		var time = $(e.currentTarget).data("time");
		var duration = parseFloat($('input[name="editxpduration"]').val());
		var day = []; var z = 0; for (i = 0; i <= 23.5; i = i + .5) {day[z] = i;z++};
		
		window.timesAvailable = _.without(window.timesAvailable, time);
		window.timesAvailable = _.sortBy(window.timesAvailable, function( time ) {return parseInt(time)});
	
		console.log("hi");
	
		$(e.currentTarget.parentElement).fadeOut('fast', function() {
			$('.timesavailable').html('');
			$('.timeselect').html('');
			
			var listInclude = day;
			
			_.each(window.timesAvailable, function(time) {
				for (i = 0; i < duration / .5; i++) {
					listInclude = _.without(listInclude, parseFloat(time) + (i * 0.5));
					listInclude = _.without(listInclude, parseFloat(time) - (i * 0.5));
				}
			});
			
			_.each(listInclude, function ( time ) { $('.timeselect').append('<option value="'+time+'">'+$this.clock[time * 2]+'</option>'); });
			_.each(window.timesAvailable, function(timeSlot) {$('.timesavailable').append('<li style="margin:3px;"><span>'+$this.clock[timeSlot*2]+'</span><span data-time="'+timeSlot+'" class="removetime">X</span></li>')});
			});	
	},
		
	preview: function( maxfile, preview, xlim, ylim, px, py, callback ) {
		filepicker.pick({
			mimetypes: ['image/*'],
			maxSize: maxfile * 1024,
			services:['COMPUTER', 'IMAGE_SEARCH', 'FLICKR', 'FACEBOOK', 'GMAIL', 'DROPBOX', 'EVERNOTE', 'GOOGLE_DRIVE'],
		  },
		  function(img){
			  $(preview).attr('src', 'https://s3-us-west-2.amazonaws.com/aggregus/assets/8-1.gif');
			  filepicker.stat(img, {width:true,height:true}, function (stat) {
				  if (stat.width < xlim || stat.height < ylim) {
					  alert("Please upload an image that is greater than "+xlim+" x "+ylim+" pixels in size.");
					  filepicker.remove(img);
				  }
				  else if ((stat.width > stat.height && (stat.height / stat.width <= .666) && maxfile == 10000) || (stat.width > stat.height && maxfile == 5000) || stat.width == stat.height) {
						  var elem = $(preview)[0];
					  	  var parent = elem.parentNode;
						  var newPreviewer = document.createElement("img");
						  newPreviewer.name = elem.name;
						  newPreviewer.height = py; 
						  newPreviewer.width = (py / stat.height) * stat.width;
						  newPreviewer.src = img.url;
						  parent.removeChild(elem);
						  parent.insertBefore(newPreviewer, parent.firstChild);
						  callback(stat.height / py, img);
				  }
				  else if (stat.height > stat.width ||  (stat.height / stat.width > .666)) {
						  var elem = $(preview)[0];
					  	  var parent = elem.parentNode;
						  var newPreviewer = document.createElement("img");
						  newPreviewer.name = elem.name;
						  newPreviewer.height = (px / stat.width) * stat.height; 
						  newPreviewer.width = px;
						  newPreviewer.src = img.url;
						  parent.removeChild(elem);
						  parent.insertBefore(newPreviewer, parent.firstChild);
						  callback(stat.width / px, img);
				  }
			  });
		  },
		  function(FPError){
			console.log(FPError.toString());
		  }
		);
	},
		
	previewProfileImg: function() {
		$this = this;
		this.preview(5000, profileimagepreview, 250, 250, 250, 250, function (ratio, img) {
					  $this.profileimg = img;
					  $('.loading').css('visibility','hidden');
					  function cropProfile( c ) {
						  window.profileCrop = [ Math.floor(c.x * ratio), Math.floor(c.y * ratio), Math.floor(c.w * ratio), Math.floor(c.h * ratio) ];
					  };
					  
					  if (window.jcrop_api) {
						  window.jcrop_api.destroy();
					  }
					  $(profileimagepreview).Jcrop({
						  aspectRatio: 1, 
						  minSize: [250, 250],
						  onSelect: cropProfile,
						  onChange: cropProfile
						  }, function() {
							  window.jcrop_api = this;
							  window.jcrop_api.setSelect([0, 0, 250, 250]);
							  $('button[data-hide="pimagesel"]').prop('disabled', false);
							  $this.imgsub = false;
							  }
					  );
		});
	},
	
	previewCoverImg: function() {
		$this = this;
		this.preview(10000, coverimagepreview, 1200, 800, 600, 400, function (ratio, img) {
					  $this.coverimg = img;
					  $('.loading').css('visibility','hidden');
					  function cropCover( c ) {
						  window.coverCrop = [ Math.floor(c.x * ratio), Math.floor(c.y * ratio), Math.floor(c.w * ratio), Math.floor(c.h * ratio) ];
					  };
					  
					  if (window.jcrop_api) {
						  window.jcrop_api.destroy();
					  }
					  $(coverimagepreview).Jcrop({
						  aspectRatio: 3/2, 
						  minSize: [600, 400],
						  onSelect: cropCover,
						  onChange: cropCover
						  }, function() {
							  window.jcrop_api = this;
							  window.jcrop_api.setSelect([0, 0, 600, 400]);
							  $('button[data-hide="cimagesel"]').prop('disabled', false);
							  $this.imgsub = false;
							  }
					  );
		});
	},
	
	goto: function( e ) {
		$this = this;
		$this.currentWindow.fadeOut('slow', function() {
			$($(e.currentTarget).data("id")).fadeIn('slow');
		});
	},
	
	updatemap: function() {
		$this = this;
			if (!$this.editXPMap) {
					$this.editXPMap = L.map('processmap').setView([48.75, -122.4869], 13);
				L.tileLayer('https://a.tiles.mapbox.com/v3/aggregus.map-keakb9ot/{z}/{x}/{y}.png', {
					maxZoom: 18
				}).addTo($this.editXPMap);
			};
			
			this.location = $(".editxp .locationentry").val();
			
			$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.location + '&sensor=false', function (data) {
				window.normal = data.results[0].formatted_address;
				window.lat = data.results[0].geometry.location.lat;
				window.lng = data.results[0].geometry.location.lng;
				$this.editXPMap.setView([window.lat, window.lng], 13);
				$(".editxp .locationentry").val(window.normal);
				var marker = L.marker([window.lat, window.lng]).addTo($this.editXPMap);
				marker.bindPopup(window.normal).openPopup();
				$(".editxp .locationentry").val(window.normal)
			});
		},
	
	updateExperience: function() {
		
		var name = $('input[name="editxpname"]').val();
		var desc = $('textarea[name="editxpdesc"]').val();
		var instr = $('textarea[name="editxpspecialinstr"]').val();
		var maxL = $('input[name="editxpmaxattend"]').val();
		var minL = $('input[name="editxpminattend"]').val();
		
		if (name.length == 0) {
			alert('Please enter a name for your experience.');
			$('input[name="editxpname"]').val(this.model.get('name'));
			return false;
		}
		if (instr.length == 0) {
			alert('Please enter guest instructions for your experience.');
			$('input[name="editxpspecialinstr"]').val(this.model.get('guestInstructions'));
			return false;
		}
		else if (desc.length == 0) {
			alert('Please enter a description for your experience.');
			$('textarea[name="editxpdesc"]').val(this.model.get('description'));
			return false;
		}
		else if (parseInt(maxL) < parseInt(minL)) {
			console.log(maxL)
			console.log(minL)
			alert('Maximum attendees cannot number fewer than minimum attendees.');
			return false;
		}
		
		$this = this;
		
		coverLoaded = true;
		profileLoaded = true;
		
		$('.loading').css('visibility','visible');

		var updateDetails = function() {
			window.datesAvailable = _.sortBy(window.datesAvailable, function( date ) { return ((parseFloat(date.slice(2,4))) * 2) + ((parseFloat(date.slice(5,7))) / 10) + ((parseFloat(date.slice(8))) / 1000) });
			window.datesUnavailable = _.sortBy(window.datesUnavailable, function( date ) { return ((parseFloat(date.slice(2,4))) * 2) + ((parseFloat(date.slice(5,7))) / 10) + ((parseFloat(date.slice(8))) / 1000) });
			window.timesAvailable = _.sortBy(window.timesAvailable, function( time ) {return parseInt(time)});
			
			if (coverLoaded == true && profileLoaded == true) {
				var update = {
					name: name,
					dateCreated: new Date(),
					description: desc,
					guestInstructions: instr,
					duration: $('input[name="editxpduration"]').val(),
					permitMixed: $('input[name="editxpexclusive"]').prop("checked"),
					restrictDates: $('input[name="restrictDatesSelect"]').prop("checked"),
					price: $('input[name="editxpprice"]').val(),
					'attendees.maximum': $('input[name="editxpmaxattend"]').val(),
					'attendees.minimum': $('input[name="editxpminattend"]').val(), 
					'attendees.total': 0,
					photoURL:  $this.photoURL == null ? $this.model.get("photoURL") : $this.photoURL,
					'location.normal': $("input[name='editxplocation']").val(),
					'location.range': 0,
					'location.lat': window.lat,
					'location.lng': window.lng,
					'dates.absyes': window.datesAvailable,
					'dates.absno': window.datesUnavailable,
					 times: window.timesAvailable
				};
				$.ajax({
					url: '/experience/' + $this.model.get("aggid"),
					type: 'PUT',
					data: {
						update: update,
					}
				}).done(function() {
					alert("Updated!");
					$this.profileimg = null;
					$this.coverimg = null;
					$this.calendar = false;
					$this.model.fetch();
				}).fail(function() {
				});
			}
		}

		if ($this.profileimg != null) {
		  profileLoaded = false;
		  
		  var profileq =  $this.profileimg.size > 250000 ? Math.floor((250000 / $this.profileimg.size) * 150 ) : 100;
		  time = new Date();
		  var profilePath = 'experiences/' + $this.model.get("aggid") + '/profileimgs/' + time.getTime() + '.jpg';
		  filepicker.convert(
			  $this.profileimg, 
			  {
				  crop: window.profileCrop,
				  quality: profileq
			  }, 
			  {
				  path: '/'+profilePath, 
				  format: 'jpg',
				  mimetype: 'image/jpeg', access: 'public'
			  }, 
			  function(storedProfile) { 
			  filepicker.remove($this.profileimg);
				$this.profileimg = profilePath;
				$.ajax({
					url: '/experience/' + $this.model.get("aggid"),
					type: 'PUT',
					data: {
						update: {
							profileimg: "https://d2qjfe4gq0m6av.cloudfront.net/" + profilePath
						}
					}
				}).done(function() {
					profileLoaded = true;
					updateDetails();
				}).fail(function() {
				});
			  });
		}
		if ($this.coverimg != null) {
			
			coverLoaded = false;
			
			var coverq =  $this.coverimg.size > 500000 ? Math.floor((500000 / $this.coverimg.size) * 150 ) : 100;
			
			  time = new Date();
			  var coverPath = 'experiences/' + $this.model.get("aggid") + '/coverimgs/' + time.getTime() + '.jpg';
			  filepicker.convert(
				  $this.coverimg, 
				  {
					  crop: window.coverCrop,
					  format: 'jpg',
					  quality: coverq
				  }, 
				  {
					  path: '/'+coverPath, 
					  mimetype: 'image/jpeg', access: 'public'
				  }, 
				  function(storedCover) {
					  filepicker.remove($this.coverimg);
				  	$this.coverimg = coverPath;
					$.ajax({
						url: '/experience/' + $this.model.get("aggid"),
						type: 'PUT',
						data: {
							update: {
								coverimg: "https://d2qjfe4gq0m6av.cloudfront.net/" + coverPath
							}
						}
					}).done(function() {
						coverLoaded = true;
						updateDetails();
					}).fail(function() {
					});
			});
		}
		else if ($this.coverimg == null && $this.profileimg == null) {
			updateDetails();
		}
	}
	});
	
	return EditXPView;
})