define(['tpl!templates/createxp.tmpl','vent', 'leaflet', 'filepicker', 'fullcalendar'], function (createxp, vent, L, filepicker, fullcalendar) {

	CreateXPView = Backbone.Marionette.ItemView.extend({
		
	template: createxp,
	
	profileimg: null,
	coverimg: null,
	
	calendar: false,
	
	coverImgUp: false,
	profileImgUp: false,
	
	photoURL: null,
	aggid: Math.floor((Math.random() + 1) * 10000000),
	
	events: {
		'click .goto':'goto',
		
		'click .createxplocation':'updatemap',
		
		'click button[name="profileimageupload"]':'previewProfileImg',
		'click button[name="coverimageupload"]':'previewCoverImg',
		
		'click .previewAlbumStart':'previewAlbum',
		
		'click .addtime':'addtime',
		'click .removetime':'removetime',
		
		'click .createxpfinish':'experiencesubmit',
		
		'click label':'showtip',
		
		'change input[name="createxpduration"]':'resetTimes'
	},
	
	resetTimes: function() {
		window.timesAvailable = [];
		$('.timeselect').html('');
		$('.timesavailable').html('');
		var duration = parseFloat($('input[name="createxpduration"]').val());
		var day = []; var z = 0; for (i = 0; i <= 23.5; i = i + .5) {day[z] = i;z++};
		
		var listInclude = day;
		
		_.each(window.timesAvailable, function(timeSlot) {$('.timesavailable').append('<li style="margin:3px;"><span>'+window.clock[timeSlot*2]+'</span><span data-time="'+timeSlot+'" class="removetime">X</span></li>')})
		
		_.each(window.timesAvailable, function(time) {
			for (i = 0; i < duration / .5; i++) {
				listInclude = _.without(listInclude, parseFloat(time) + (i * 0.5));
				listInclude = _.without(listInclude, parseFloat(time) - (i * 0.5));
			}
		});
		
		_.each(listInclude, function ( time ) { $('.timeselect').append('<option value="'+time+'">'+window.clock[time * 2]+'</option>'); });
	},
	
	initialize: function() {
		window.lat = null;
		$('body').removeClass('nooverflow');
		
		if (this.model.get("emailconfirm") != "yes" && this.model.get("emailconfirm") != null) {
			alert("Please confirm your email before creating an experience.");
			Backbone.history.navigate("index", {trigger: true});
		}
	},
	
	currentSection: 0,
	
	onRender: function() {
		
		filepicker.setKey('A9lplqyzRNu27ZCOmWrrPz');
		
		$('body').removeClass('nooverflow');
		
		$('.createxp .termscol').fadeIn('slow');
		
		window.timesAvailable = [];
		window.datesAvailable = [];
		window.datesUnavailable = [];
	},
	
	showtip: function(e) {
		alert($(e.currentTarget).data("tip"));
	},
	
	previewAlbum: function() {
		var urlCheck = /(?:imgur.com\/a\/)\w{5}(\/*)$/;
		var url = ($('#createxpphotos').val()).match(urlCheck);
		if ( url == null) {
			alert("There's something amiss with your Imgur URL! Try entering it again. Make sure that there are only five characters after the '/a/', and that ");
			return false;
		}
		else {
			$('#createxpphotos').val('http://www.' + url[0])
			$('.previewAlbum').html('<iframe class="imgur-album" width="350" height="337" frameborder="0" src="'+$('#createxpphotos').val()+'/embed"></iframe>')
			$this.photoURL = '<iframe class="imgur-album" width="350" height="337" frameborder="0" src="'+$('#createxpphotos').val()+'/embed"></iframe>';
		}
	},
	
	addtime: function() {
		
		$this = this;
		
		var time = parseFloat($('.timeselect').val());
		var duration = parseFloat($('input[name="createxpduration"]').val());
		var day = []; var z = 0; for (i = 0; i <= 23.5; i = i + .5) {day[z] = i;z++};
		
		if (_.contains(window.timesAvailable, time)) {
			return false;
		}
		else {
			
			window.timesAvailable.push(time);
			window.timesAvailable = _.sortBy(window.timesAvailable, function( time ) {return parseInt(time)});
			
			$('.timeselect').html('');
			$('.timesavailable').html('');
			
			_.each(window.timesAvailable, function(timeSlot) {$('.timesavailable').append('<li style="margin:3px;"><span>'+window.clock[timeSlot*2]+'</span><span data-time="'+timeSlot+'" class="removetime">X</span></li>')});
			
			var listInclude = day;
			
			_.each(window.timesAvailable, function(time) {
				for (i = 0; i < duration / .5; i++) {
					listInclude = _.without(listInclude, parseFloat(time) + (i * 0.5));
					listInclude = _.without(listInclude, parseFloat(time) - (i * 0.5));
				}
			});
			
			_.each(listInclude, function ( time ) { $('.timeselect').append('<option value="'+time+'">'+window.clock[time * 2]+'</option>'); });
		
		}
	},
	
	removetime: function( e ) {
		$this = this;
		
		var time = $(e.currentTarget).data("time");
		var duration = parseFloat($('input[name="createxpduration"]').val());
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
			
			_.each(listInclude, function ( time ) { $('.timeselect').append('<option value="'+time+'">'+window.clock[time * 2]+'</option>'); });
			_.each(window.timesAvailable, function(timeSlot) {$('.timesavailable').append('<li style="margin:3px;"><span>'+window.clock[timeSlot*2]+'</span><span data-time="'+timeSlot+'" class="removetime">X</span></li>')});
			});	
	},
	
preview: function( maxfile, loading, preview, xlim, ylim, px, py, callback ) {
		filepicker.pick({
			mimetypes: ['image/*'],
			maxSize: maxfile * 1024,
			services:['COMPUTER', 'IMAGE_SEARCH', 'FLICKR', 'FACEBOOK', 'GMAIL', 'DROPBOX', 'EVERNOTE', 'GOOGLE_DRIVE']
		  },
		  function(img){
			  $(loading).css('visibility','visible');
			  filepicker.stat(img, {width:true,height:true}, function (stat) {
				  if (stat.width < xlim || stat.height < ylim) {
					  alert("Please upload an image that is greater than "+xlim+" x "+ylim+" pixels in size.");
					  $(loading).css('visibility','hidden');
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
			  }, function(error) {
				  alert("Sorry, there was an error previewing your image. Please try again.");
			  });
		  },
		  function(FPError){
			console.log(FPError.toString());
			alert("Sorry! There was an error previewing your image - please try again.");
		  },
		  function(percent) {
			  console.log(percent);
		  }
		);
	},
	
	previewProfileImg: function() {
		$this = this;
		this.preview(5000, ".loadingprofile", profileimagepreview, 250, 250, 250, 250, function (ratio, img) {
					  $this.profileimg = img;
					  console.log(img);
					  $('.loadingprofile').css('visibility','hidden');
					  function cropProfile( c ) {
						  window.profileCrop = [ Math.floor(c.x * ratio), Math.floor(c.y * ratio), Math.floor(c.w * ratio), Math.floor(c.h * ratio) ];
					  };
					  
					  if (window.jcrop_api_profile) {
						  window.jcrop_api_profile.destroy();
					  }
					  $(profileimagepreview).Jcrop({
						  aspectRatio: 1, 
						  minSize: [250, 250],
						  onSelect: cropProfile,
						  onChange: cropProfile
						  }, function() {
							  window.jcrop_api_profile = this;
							  window.jcrop_api_profile.setSelect([0, 0, 250, 250]);
							  $('button[data-hide="pimagesel"]').prop('disabled', false);
							  $this.profileImageUp = true;
							  }
					  );
		});
	},
	
	previewCoverImg: function() {
		$this = this;
		this.preview(10000, ".loadingcover", coverimagepreview, 1200, 800, 480, 320, function (ratio, img) {
					  $this.coverimg = img;
					  $('.loadingcover').css('visibility','hidden');
					  function cropCover( c ) {
						  window.coverCrop = [ Math.floor(c.x * ratio), Math.floor(c.y * ratio), Math.floor(c.w * ratio), Math.floor(c.h * ratio) ];
					  };
					  
					  if (window.jcrop_api_cover) {
						  window.jcrop_api_cover.destroy();
					  }
					  $(coverimagepreview).Jcrop({
						  aspectRatio: 3/2, 
						  minSize: [480, 320],
						  onSelect: cropCover,
						  onChange: cropCover
						  }, function() {
							  window.jcrop_api_cover = this;
							  window.jcrop_api_cover.setSelect([0, 0, 480, 320]);
							  $('button[data-hide="cimagesel"]').prop('disabled', false);
							  $this.coverImageUp = true;
							  }
					  );
		});
	},
	
	goto: function( e ) {
		
		$this = this;
		
		var show = $(e.currentTarget).data("show");
		var hide = $(e.currentTarget).data("hide");
		
		var next = function( callback ) {
			$('.'+ hide).fadeOut('slow', function() {
			  window.scrollTo(0, 0);
			  $('.'+ show).fadeIn('slow', function() {
				  if (callback) {
						callback();
					}
			  });
			});
			$('.selected').removeClass('selected');
			$('.item[data-id="'+show+'"]').addClass('selected');
		}
		
		if (show =="basicscol") {
			$this = this;
			next(function() {
			$(document).ready(function() {
			   if (!$this.createXPMap) {
					$this.createXPMap = L.map('processmap').setView([48.75, -122.4869], 13);
					L.tileLayer('https://a.tiles.mapbox.com/v3/aggregus.map-keakb9ot/{z}/{x}/{y}.png', {
					maxZoom: 18
				}).addTo($this.createXPMap);
				}
			});
			});
		}
		
		else if (hide == "basicscol" && show == "mediacol") {
			var name = $('input[name="createxpname"]').val();
			var desc = $('textarea[name="createxpdesc"]').val();
			var instr = $('textarea[name="createxpspecialinstr"]').val();
			var price = $('input[name="createxpprice"]').val();
			var maxAttend = $('input[name="createxpmaxattend"]').val();
			var minAttend = $('input[name="createxpminattend"]').val();
			var profile = $('#profileimageupload');
			var cover = $('#coverimageupload');
			
			if (name.length == 0) {
				$('.basicscol .error').text('Please enter a name for your experience.');
				return false;
			}
			else if (instr.length == 0) {
				$('.basicscol .error').text('Please enter special instructions for your experience.');
				return false;
			}
			else if (desc.length == 0) {
				$('.basicscol .error').text('Please enter a description for your experience.');
				return false;
			}
			else if (!window.lat) {
				$('.basicscol .error').text('Please enter a location for your experience.');
				return false;
			}
			else if (price.length == 0) {
				$('.basicscol .error').text('Please enter a price for your experience.');
				return false;
			}
			else if (maxAttend.length == 0) {
				$('.basicscol .error').text('Please enter the maximum number of attendees for your experience.');
				return false;
			}
			else if (minAttend.length == 0) {
				$('.basicscol .error').text('Please enter the minimum number of attendees for your experience.');
				return false;
			}
			else if (parseInt(maxAttend) < parseInt(minAttend)) {
				$('.basicscol .error').text('Maximum attendees cannot number fewer than minimum attendees.');
				return false;
			}
			else if (!window.normal || !window.lat || !window.lng) {
				$('.basicscol .error').text('Please enter a location for your experience.');
				return false;
			}
			else if ($this.profileimg == null) {
				$('.basicscol .error').text('Please submit a profile image for your experience.');
				return false;
			}
			else if ($this.coverimg == null) {
				$('.basicscol .error').text('Please submit a cover image for your experience.');
				return false;
			}
			else {
				if ($this.profileImageUp == true) {
				  $('.selected').removeClass('selected');
				  $('.item[data-id="'+show+'"]').addClass('selected');
				  time = new Date();
				  
				  var profilePath = 'experiences/' + $this.aggid + '/profileimgs/' + time.getTime() + '.jpg';
				  var profileQual =  $this.profileimg.size > 250000 ? Math.floor((250000 / $this.profileimg.size) * 150 ) : 100;
				  
				  filepicker.convert(
					  $this.profileimg, 
					  {
						  crop: window.profileCrop,
						  quality: profileQual
					  }, 
					  {
						  path: '/' + profilePath,
						  format: 'jpg', 
						  mimetype: 'image/jpeg',
						  access: 'public'
					  }, 
					  function(storedProfile) {
						filepicker.remove($this.profileimg);
						$this.profileimg = "https://d2qjfe4gq0m6av.cloudfront.net/" + profilePath;
						$this.profileImageUp = false;  
					  },
					  function( error ) {
						  console.log(error);
						  alert("Sorry, there was an error uploading your profile image. Please try again!");
					  },
					  function( percent ) {
						  console.log(percent);
					  })
			  }
			  
			  if ($this.coverImageUp == true) {
				  var coverPath = 'experiences/' + $this.aggid + '/coverimgs/' + time.getTime() + '.jpg';
				  var coverQual =  $this.coverimg.size > 500000 ? Math.floor((500000 / $this.coverimg.size) * 150 ) : 100;
				  
				  console.log("cover start");
				  
				  filepicker.convert(
					  $this.coverimg, 
					  {
						  crop: window.coverCrop,
						  quality: coverQual
					  }, 
					  {
						  path: '/'+coverPath,
						  format: 'jpg', 
						  mimetype: 'image/jpeg',
						  access: 'public'
					  }, 
					  function(storedCover) {
						filepicker.remove($this.coverimg);
						$this.coverimg = "https://d2qjfe4gq0m6av.cloudfront.net/" + coverPath;
						$this.coverImageUp = false; 
					  },
					  function(error ) {
						  console.log(error);
						  alert("Sorry, there was an error uploading your cover image. Please try again!");
					  },
					  function( percent ) {
						  console.log(percent);
					  })
				  }
			}
			var wait = window.setInterval(function() {
				if ($this.coverImageUp == true || $this.profileImageUp == true) {
					$('img[name="photoloadgif"]').show();
				}
				else {
					$('img[name="photoloadgif"]').hide();
					window.clearInterval(wait);
					next();
				}
			}, 200)
		}
		
		else if (show == "availabilitycol" && hide == "mediacol") {
		next(function() {
			
			$('.timeselect').html('');
			$('.timesavailable').html('');
			var duration = parseFloat($('input[name="createxpduration"]').val());
			var day = []; var z = 0; for (i = 0; i <= 23.5; i = i + .5) {day[z] = i;z++};
			
			var listInclude = day;
			
			_.each(window.timesAvailable, function(timeSlot) {$('.timesavailable').append('<li style="margin:3px;"><span>'+window.clock[timeSlot*2]+'</span><span data-time="'+timeSlot+'" class="removetime">X</span></li>')})
			
			_.each(window.timesAvailable, function(time) {
				for (i = 0; i < duration / .5; i++) {
					listInclude = _.without(listInclude, parseFloat(time) + (i * 0.5));
					listInclude = _.without(listInclude, parseFloat(time) - (i * 0.5));
				}
			});
			
			_.each(listInclude, function ( time ) { $('.timeselect').append('<option value="'+time+'">'+window.clock[time * 2]+'</option>'); });
			
			var resetCallbacks = function() {
				$('.notavailablebtn').click(function() {
					
					var change = $('input[name="createxpdateholder"]').val();
					
					if (_.contains(window.datesUnavailable, change)) {
						return false;
					}
	
					if (_.contains(window.datesAvailable, change)) {
						window.datesAvailable = _.without(window.datesAvailable, change);
					}
					
					$('.availabilityDialog').remove();
					
					$('td[data-date="' + change + '"]').removeClass('dateAvailable');
					$('td[data-date="' + change + '"]').addClass('dateUnavailable');
					
					window.datesUnavailable.push(change);
				});
				
				$('.availablebtn').click(function() {
					
					var change = $('input[name="createxpdateholder"]').val();
					
					if (_.contains(window.datesAvailable, change)) {
						return false;
					}
					
					if (_.contains(window.datesUnavailable, change)) {
						window.datesUnavailable = _.without(window.datesUnavailable, change);
					}
					
					$('.availabilityDialog').remove();
					
					$('td[data-date="' + change + '"]').removeClass('dateUnavailable');
					$('td[data-date="' + change + '"]').addClass('dateAvailable');
					
					window.datesAvailable.push(change);
				});
				
				$('.removebtn').click(function() {
					$('.availabilityDialog').remove();
					
					var change = $('input[name="createxpdateholder"]').val();
					
					if (_.contains(window.datesAvailable, change)) {
						window.datesAvailable = _.without(window.datesAvailable, change);
					}
					
					if (_.contains(window.datesUnavailable, change)) {
						window.datesUnavailable = _.without(window.datesUnavailable, change);
					}
					
					$('td[data-date="' + change + '"]').css('background-color','white');
				});
			}
					
			var today = new Date();
			if ($this.calendar == false) {
			$('#calendar').fullCalendar({
					  dayClick: function( date, allDay, jsEvent, view ) {
						  if (date > today) {	
							  var date = jsEvent.currentTarget.dataset.date;
							  $('input[name="createxpdateholder"]').val(date);
							  
							  $('.availabilityDialog').remove();
							  
							  var offset = $('td[data-date="'+date+'"]').offset();
							  offset.left = offset.left - 45;
							  offset.top = offset.top - 200;
							  
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
			$this.calendar = true;
			}
			
			$('.fc-button-prev').click(function() {
				window.datesAvailable.forEach(function( day ) {
					$('td[data-date="' + day + '"]').addClass('dateAvailable');
				});
				window.datesUnavailable.forEach(function( day ) {
					$('td[data-date="' + day + '"]').addClass('dateUnavailable');
				});
			});
			
			$('.fc-button-next').click(function() {
				window.datesAvailable.forEach(function( day ) {
					$('td[data-date="' + day + '"]').addClass('dateAvailable');
				});
				window.datesUnavailable.forEach(function( day ) {
					$('td[data-date="' + day + '"]').addClass('dateUnavailable');
				});
			});
			})
		}
		
		else if (show == "finishcol") {
			if (window.timesAvailable.length == 0) {
				alert("You must provide at least one time at which the experience occurs.");
				return false;
			}
			next();
		}
		else {
			next();
		}
	},
	
	updatemap: function() {
		$this = this;
			if (!$this.createXPMap) {
					$this.createXpMap = L.map('processmap').setView([48.75, -122.4869], 15);
				L.tileLayer('https://a.tiles.mapbox.com/v3/aggregus.map-keakb9ot/{z}/{x}/{y}.png', {
					maxZoom: 20
				}).addTo($this.createXPMap);
			};
			
			this.location = $(".createxp .locationentry").val();
			
			$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.location + '&sensor=false', function (data) {
				window.normal = data.results[0].formatted_address;
				window.lat = data.results[0].geometry.location.lat;
				window.lng = data.results[0].geometry.location.lng;
				$this.createXPMap.setView([window.lat, window.lng], 13);
				var marker = L.marker([window.lat, window.lng]).addTo($this.createXPMap);
				marker.bindPopup(window.normal).openPopup();
				$(".createxp .locationentry").val(window.normal)
			});
		},
	
	experiencesubmit: function() {
			$this = this;
			$.ajax({
			url: '/logincheck',
			type:'GET'
		}).done(function( user ) {
			
			window.datesAvailable = _.sortBy(window.datesAvailable, function( date ) { return ((parseFloat(date.slice(2,4))) * 2) + ((parseFloat(date.slice(5,7))) / 10) + ((parseFloat(date.slice(8))) / 1000) });
			window.datesUnavailable = _.sortBy(window.datesUnavailable, function( date ) { return ((parseFloat(date.slice(2,4))) * 2) + ((parseFloat(date.slice(5,7))) / 10) + ((parseFloat(date.slice(8))) / 1000) });
			window.timesAvailable = _.sortBy(window.timesAvailable, function( time ) {return parseInt(time)});
			
			var experience = {
					aggid: $this.aggid,
					name: $('input[name="createxpname"]').val(),
					dateCreated: new Date(),
					description: $('textarea[name="createxpdesc"]').val(),
					price: $('input[name="createxpprice"]').val(),
					'attendees.maximum': $('input[name="createxpmaxattend"]').val(),
					'attendees.minimum': $('input[name="createxpminattend"]').val(), 
					'attendees.total': 0,
					profileimg: $this.profileimg,
	  				guestInstructions: $('textarea[name="createxpspecialinstr"]').val(),
					permitMixed: $('input[name="createxpexclusive"]').prop("checked"),
					restrictDates: $('input[name="restrictDatesSelect"]').prop("checked"),
					creator: {
						name: {
							first: window.user.get('name').first,
							last: window.user.get('name').last
						},
						profileimg: window.user.get('profileimg'),
						description: window.user.get('description'),
						aggid: window.user.get('aggid'),
						location: {
							normal: window.user.get('location').normal
						},
						email: window.user.get('email')
					},
					photoURL:  $this.photoURL,
					
					duration: $('input[name="createxpduration"]').val(),
					coverimg: $this.coverimg,
					
					'location.normal': $(".createxp .locationentry").val(),
					'location.range': 0,
					'location.lat': window.lat,
					'location.lng': window.lng,
					'dates.absyes': window.datesAvailable,
					'dates.absno': window.datesUnavailable,
					times: window.timesAvailable,
				};
				$.ajax({
					url: '/experience',
					type: 'POST',
					data: {
						experience: experience,
					}
				});
		}).done(function(data) {
			alert("Thanks for posting on Aggregus!");
			Backbone.history.navigate("experience/"+$this.aggid, {trigger: true});
		}).fail(function() {
		});
		}
	
	});
	
	return CreateXPView;
})