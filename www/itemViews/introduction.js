define(['tpl!templates/introduction.tmpl','lib/jcrop','vent', 'leaflet', 'filepicker'], function (introduction, Jcrop, vent, L, filepicker) {

	IntroductionView = Backbone.Marionette.ItemView.extend({
		
	template: introduction,
	
	profileimg: null,
	coverimg: null,
	location: null,
	description: null,
	
	profileImageUp: false,
	coverImageUp: false,
	
	onRender: function() {
		filepicker.setKey('A9lplqyzRNu27ZCOmWrrPz');
		console.log(this.model);
		window.normal = "Pandatopia";
		window.lat = 30.6636;
		window.lng = 104.0667;
	},
	
	initialize: function() {
		$('body').removeClass('nooverflow');
		this.model.on("change", this.render, this);
	},
	
	events: {
		'click .goto':'goto',
		'click a[name="skip"]':'skip',
		'click button[name="profileimageupload"]':'previewProfileImg',
		'click button[name="coverimageupload"]':'previewCoverImg',
		'click .updatemap':'updatemap',
		'click .create':'create'
	},
	
	goto: function( e ) {
		$this = this;
		e.preventDefault();
		
		var show = $(e.currentTarget).data("show");
		var hide = $(e.currentTarget).data("hide");
		var bypass = $(e.currentTarget).data("bypass");
		
		if (show == "imagesel") {
			$('.'+ hide).fadeOut('slow', function() {
			  window.scrollTo(0, 0);
			  $('.'+ show).fadeIn('slow');
			});
			$('.selected').removeClass('selected');
			$('.item[data-id="'+show+'"]').addClass('selected');
		}
		
		if (hide == "imagesel") {
			
			var $this = this;
			
			if ($this.profileimg == null && bypass == false) {
				alert("Please upload a profile image.");
				return false;	
			}
			
			if ($this.coverimg == null && bypass == false) {
				alert("Please upload a cover image.");
				return false;	
			}
			
			else {
			  $('.'+ hide).fadeOut('slow', function() {
				window.scrollTo(0, 0);
				$('.'+ show).fadeIn('slow',function() {
							   if (!window.introMap) {
					window.introMap = L.map('map').setView([$this.model.get("location").lat, $this.model.get("location").lng], 13);
					window.introMap.dragging.disable();
					L.tileLayer('https://a.tiles.mapbox.com/v3/aggregus.map-keakb9ot/{z}/{x}/{y}.png', {
					maxZoom: 18
				}).addTo(window.introMap);
				}
				});
				
			  });
			  if (bypass == false && $this.profileImageUp == true) {
				  $('.selected').removeClass('selected');
				  $('.item[data-id="'+show+'"]').addClass('selected');
				  time = new Date();
				  
				  var profilePath = 'users/' + window.user.get('aggid') + '/profileimgs/' + time.getTime() + '.jpg';
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
						  
						$this.profileImageUp = false;  
						  
						filepicker.remove($this.profileimg);
				
						$.ajax({
							url: '/accounts',
							type: 'PUT',
							data: {
								update: {
									profilepick: storedProfile,
									profileimg: "https://d2qjfe4gq0m6av.cloudfront.net/" + profilePath
								},
							}
							
						}).done(function() {
						}).fail(function() {
						});
					  });
			  }
			  
			  if (bypass == false && $this.coverImageUp == true) {
				  var coverPath = 'users/' + window.user.get('aggid') + '/coverimgs/' + time.getTime() + '.jpg';
				  var coverQual =  $this.coverimg.size > 500000 ? Math.floor((500000 / $this.coverimg.size) * 150 ) : 100;
				  
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
						$this.coverImageUp = false;  
						  
						filepicker.remove($this.coverimg);
				
						$.ajax({
							url: '/accounts',
							type: 'PUT',
							data: {
								update: {
									coverpick: storedCover,
									coverimg: "https://d2qjfe4gq0m6av.cloudfront.net/" + coverPath
								},
							}
							
						}).done(function() {
						}).fail(function() {
						});
					  });
				  }
			}
		}
	
		if (show == "descriptionsel") {
			if (bypass == false && ($("input[name='locationentry']").val() == '' || !window.lat || !window.lng)) {
				alert("Please enter a location and press 'Find me!'");
				return false;
			}
			else {
			  $('.'+hide).fadeOut('slow', function() {
				window.scrollTo(0, 0);
				$('.'+show).fadeIn('slow');
			  });
			  $('.selected').removeClass('selected');
			  $('.item[data-id="'+show+'"]').addClass('selected');
			}
		}
		if (show == "sallyforth") {
			if (($("textarea[name='introdesc']").val() == '' || $("textarea[name='introdesc']").val() == undefined) && bypass == false)  {
				alert("Please enter a description of your lovely self!");
				return false;
			}
			else {
			  $this.description = $("textarea[name='introdesc']").val();	
			  $('.'+hide).fadeOut('slow', function() {
				window.scrollTo(0, 0);
				$('.'+show).fadeIn('slow');
			  });
			  $('.selected').removeClass('selected');
			  $('.item[data-id="'+show+'"]').addClass('selected');
			}
		}
		else {
			$('.'+hide).fadeOut('slow', function() {
				window.scrollTo(0, 0);
				$('.'+show).fadeIn('slow');
			  });
			  $('.selected').removeClass('selected');
			  $('.item[data-id="'+show+'"]').addClass('selected');
		}
	},
	
	preview: function( maxfile, loading, preview, xlim, ylim, px, py, callback ) {
		filepicker.pick({
			mimetypes: ['image/*'],
			maxSize: maxfile * 1024,
			services:['COMPUTER', 'IMAGE_SEARCH', 'FLICKR', 'FACEBOOK', 'GMAIL', 'DROPBOX', 'EVERNOTE', 'GOOGLE_DRIVE'],
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
			  });
		  },
		  function(FPError){
			console.log(FPError.toString());
		  }
		);
	},
	
	previewProfileImg: function() {
		$this = this;
		this.preview(5000, ".loadingprofile", profileimagepreview, 250, 250, 250, 250, function (ratio, img) {
					  $this.profileimg = img;
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
	
	updatemap: function() {
		this.location = $("input[name='locationentry']").val();
			$.ajax({
					url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.location + '&sensor=false', 
					type: "GET"
			}).done(function (data) {
				if (data.status == "ZERO_RESULTS" || data.status == "INVALID_REQUEST") {
					alert("We were unable to find your address. Please retry.");
				}
				if (window.marker) {
					window.introMap.removeLayer(window.marker)
				};
				
				window.normal = data.results[0].formatted_address;
				window.lat = data.results[0].geometry.location.lat;
				window.lng = data.results[0].geometry.location.lng;
				window.introMap.setView([window.lat, window.lng], 13);
				
				if (window.introMarker) {
					window.introMap.removeLayer(window.introMarker);
					window.marker = L.marker([window.lat, window.lng]).addTo(window.introMap);
					window.marker.bindPopup(window.normal).openPopup();
				}
				else {
					window.marker = L.marker([window.lat, window.lng]).addTo(window.introMap);
					window.marker.bindPopup(window.normal).openPopup();
				}
				
				$('button[data-hide="locationsel"]').prop('disabled', false);
				$('input[name="locationentry"]').val(window.normal);
			}).fail(function() {
				alert("We were unable to find your address. Please retry.");
			});
	},
	
	create: function() {
	 $this = this;
	 var update = {
		description: $this.description != null ? $this.description : "None... yet!",
		'location.normal': window.normal,
		'location.lat': window.lat,
		'location.lng': window.lng,
	};
	$.ajax({
		url: '/accounts',
		type: 'PUT',
		data: {
			update: update,
		}
	}).done(function() {
		vent.fetch = true;
		vent.trigger('pages:dashboard');
	}).fail(function() {
		alert("Sorry, there was an error creating your profile!");
	});
	},
	
	skip: function() {
		vent.fetch = true;
	}
});
	
	return IntroductionView;
})