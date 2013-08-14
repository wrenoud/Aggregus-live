define(['tpl!templates/dashboard.tmpl', 'collectionViews/dashboard/notifications', 'models/notification', 'collectionViews/dashboard/messages', 'models/message', 'collectionViews/dashboard/experiences', 'models/experience', 'collectionViews/dashboard/bookings', 'models/booking', 'collectionViews/dashboard/hearts', 'models/heart', 'vent', 'filepicker', 'stripe'], function (dashboard, notificationsView, notificationModel, messagesView, messageModel, experiencesView, experienceModel, bookingsView, bookingModel, heartsView, heartModel, vent, filepicker, Stripe) {
	DashboardLayout = Backbone.Marionette.Layout.extend({
	template: dashboard,
	
	profileimg: null,
	coverimg: null,
	profileupload: true,
	photoURL: null,
	coverupload: true,
	updateJSON: null,
	
	events: {
		'click .item':'menuselect',
		'click .notification .delete':'deleteNotification',
		'click .msg .delete':'deleteMessage',
		'click div[data-id="editprofilecol"]':'initMap',
		'click .locationsettingreset':'updatemap',
		'click button[name="profileimageupload"]':'previewProfileImg',
		'click button[name="coverimageupload"]':'previewCoverImg',
		'click .updatesettings':'updateProfile',
		'click button[name="createxp"]':'createXP',
		'click .changeaccountemail':'changeaccountemail',
		'click .deleteaccount':'deleteaccount',
		'click .booking .delete':'deletebooking',
		'click .previewAlbumStart':'previewAlbum',
		'click .changeaccountpassword':'changeaccountpassword',
		'click .changebankaccount':'changebankaccount',
		'click .requestPayout':'requestPayout'
	},
	  
	initialize: function() {
		this.model.on("change", this.render, this);
		filepicker.setKey('A9lplqyzRNu27ZCOmWrrPz');
		$('body').removeClass('nooverflow');
		Stripe.setPublishableKey('pk_live_8OslMpaElrcFbR8k2UjbrQaJ');
	},
	
	onBeforeRender: function() {
		window.normal = this.model.get("location").normal;
		window.lat = this.model.get("location").lat;
		window.lng = this.model.get("location").lng;
		window.scrollTo(0, 0);
	},
	
	menuselect: function( e ) {
		e.preventDefault();
		$('.item').removeClass('selected');
		$(e.currentTarget).addClass('selected');
		$('.dashgencol').fadeOut("fast");
		var showGenCol = "." + $(e.currentTarget).data("id");
		$(showGenCol).fadeIn("slow");
	},
	
	previewAlbum: function() {
		var urlCheck = /\w+(\/*)$/g;
			var clean = /\w+/g;
			var url = clean.exec(urlCheck.exec($('#userphotos').val()));
			if ( url == "null") {
				alert("There's something amiss with your Imgur URL! Try entering it again.");
				return false;
			}
			else {
				$('.previewAlbum').html('<iframe class="imgur-album" width="350" height="337" frameborder="0" src="'+$('#userphotos').val()+'/embed"></iframe>')
				$this.photoURL = '<iframe class="imgur-album" width="350" height="337" frameborder="0" src="'+$('#userphotos').val()+'/embed"></iframe>';
			}
	},
	
	requestPayout: function() {
		  
		  var bankConfirm = confirm("Have you provided your bank account details? If not, your payout will be manual (check, cash, or PayPal). Press 'Yes' if you have, or are OK with a manual payout.");
		  
		  if (bankConfirm == false) {
			  return false
		  }
		  
		  $this = this;
		  
		  var now = new Date();
		  
		  $.ajax({
			  url: '/help',
			  type: 'POST',
			  data: {
			  	request: {
					userid: $this.model.get("aggid"),
					name: {
						first: $this.model.get("name").first,
						last: $this.model.get("name").last,
					},
					message: "I WANT MY MONEY RHAT NOOWWWWW!!! PLZ!!!!!!!! I THANK YOU OWE ME " +$this.model.get("balanceOwed")+ " DOLLERZ. SEND IT !",
					time: now
				}
			  }
			  }).done(function() {
				  alert("Payout request sent! Expect your money to be deposited in your account within 1 - 3 business day. We'll inform you if there are any errors with your account.");
			  }).fail(function() {
			  	  alert("There was an error. Please try again soon, or send us a message directly.");
			  });
	},
	
	changebankaccount: function() {
		var routing = $('.bankRouting').val();
		var accountnum = $('.bankAccount').val();
		var taxID = $('.bankTaxId').val();
		var legalName = $('.bankName').val();
		var type = $('.bankType').val();
		
		if (routing.length == 0) {
			alert("Please enter a routing number.");
			return false;
		}
		
		if (accountnum.length == 0) {
			alert("Please enter an account number.");
			return false;
		}

		if (taxID.length == 0) {
			alert("Please enter your tax ID.");
			return false;
		}
		
		if (legalName.length == 0) {
			alert("Please enter the legal name on your account.");
			return false;
		}
	
		if (type == "null") {
			alert("Please enter an account type.");
			return false;
		}
		
		if (Stripe.bankAccount.validateRoutingNumber(routing, 'US') != true) {
			alert("Your routing number is invalid. Please reenter.");
			return false;
		}
		
		if (Stripe.bankAccount.validateAccountNumber(accountnum, 'US') != true) {
			alert("Your bank account number is invalid. Please reenter.");
			return false;
		}
		
		$.ajax({
			url: '/updateBank',
			type: 'POST',
			data: {
				update: {
					name: legalName,
					type: type,
					tax_id: taxID,
					bank_account: {
						country: 'US',
						routing_number: routing,
						account_number: accountnum,
					},
					email: window.user.get("email"),
					description: "Aggid: " + window.user.get("aggid")
				}
			}
		}).done(function() {
			alert("Bank account logged!");
			$this.model.fetch();
		}).fail(function() {
			alert("There was an error processing your details. Please double check and try again.");
		});	
		
	},
	
	changeaccountpassword: function() {
		var oldPass = $('.changeaccountpasswordinputold').val();
		var newPass = $('.changeaccountpasswordinputnew').val();
		
		if (oldPass.length == 0) {
			alert("Please enter your current password before updating.");
			return false;
		}
		
		if (newPass.length == 0) {
			alert("Please enter a new password before updating.");
			return false;
		}
		
		if (newPass.length <= 5) {
			alert("Your new password must exceed five characters in size.");
			return false;
		}
		
		$.ajax({
			url:'/changepassword',
			type:'POST',
			data: {
				password: {
					new: newPass, 
					old: oldPass, 
				}
			}
		}).done(function() {
			alert("Password updated!");
		}).fail(function( err ) {
			if (err.status == 500) {
				alert("Sorry, there was a server error. We should have it fixed soon, but to be sure make sure to message us via the (?) button in the nav bar, or send an email to broken@aggregus.com.");
			}
			else if (err.status == 401) {
				alert("Sorry, your password did not match. Please try again.");
			}
			
		});
	},
	
	changeaccountemail: function() {
		
		$this = this;
		
		if ($('.changeaccountemailinput').val() == this.model.get("email") || $('.changeaccountemailinput').val().length == 0) {
			return false
		}
		
		$.ajax({
			url: '/account/email',
			type: 'PUT',
			data: {
				update: {
					aggid: this.model.get("aggid"),
					emailconfirm: Math.floor((Math.random() + 1) * 10000000),
					email: $('.changeaccountemailinput').val()
				}
			}
		}).done(function(){
			alert("Success! Check your email for a confirmation email. Remember, you can't create experiences until your email account is confirmed.");
			$this.model.fetch();
		}).fail(function(){
			alert("There was an error! Shame on us!")
		});
	},
	
	createXP: function() {
		if (this.model.get("emailconfirm") != "yes") {
			alert("I'm sorry, but you haven't confirmed your account yet. Please check your email for the confirmation link. Thanks!");
		} 
		else {
			vent.trigger("pages:createxp");
		}
	},
	
	deletebooking: function( e ) {
		
		var bookingdelconfirm = confirm("Are you sure you want to cancel this booking? Please ensure you have reviewed our terms of cancellation.");
		if (bookingdelconfirm == true) {
			$.ajax({
				url: '/booking/' + $(e.currentTarget).data("id"),
				type: 'DELETE'
			}).done(function() {
				$(e.currentTarget.parentElement).fadeOut('slow');
				var remaining = $('.notifcount').text();
				$('.notifcount').text(remaining - 1);
				if ($('.bookingcount').text() == 0) {
					$('.bookingcount').remove();
					window.bookings.reset();
					$('.bookingscol').text("Sorry, no notifications to display!");
				}
			}).fail(function(){
				alert("Doh! There was an error - sorry about that!");
			});	
		}
	},
	
	deleteaccount: function() {
		var ohno = confirm("Are you sure you want to delete your account? You cannot undo this decision!");
		if (ohno == true) {
			$.ajax({
				url: '/accounts/' + this.model.get('aggid'),
				type: 'DELETE'
			});
			$.ajax({
				url: '/accounts/' + this.model.get('aggid'),
				type: 'DELETE'
			});
		}
	},
	
	preview: function( maxfile, preview, xlim, ylim, px, py, callback ) {
		filepicker.pick({
			mimetypes: ['image/*'],
			maxSize: maxfile * 1024,
			services:['COMPUTER', 'IMAGE_SEARCH', 'FLICKR', 'FACEBOOK', 'GMAIL', 'DROPBOX', 'EVERNOTE', 'GOOGLE_DRIVE']
		  },
		  function(img){
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
							  $this.profileupload = false;
							  }
					  );
		});
	},
	
	previewCoverImg: function() {
		$this = this;
		this.preview(10000, coverimagepreview, 1200, 800, 475, 316.66, function (ratio, img) {
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
						  minSize: [475, 316.66],
						  onSelect: cropCover,
						  onChange: cropCover
						  }, function() {
							  window.jcrop_api = this;
							  window.jcrop_api.setSelect([0, 0, 475, 316.66]);
							  $this.coverupload = false;
							  }
					  );
		});
	},
	
		
	initMap: function() {
		$(document).ready(function() {
				window.profileSettingMap = L.map('locsettingmap').setView([window.user.get("location").lat, window.user.get("location").lng], 13);
				L.tileLayer('https://a.tiles.mapbox.com/v3/aggregus.map-keakb9ot/{z}/{x}/{y}.png', {
				maxZoom: 18
			}).addTo(window.profileSettingMap);
		});
	},
	
	updatemap: function() {
		this.location = $("input[name='user-locationsetting']").val();
			$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.location + '&sensor=false', function (data) {
				if (window.marker) {
					window.introMap.removeLayer(window.marker)
				};
				window.normal = data.results[0].formatted_address;
				window.lat = data.results[0].geometry.location.lat;
				window.lng = data.results[0].geometry.location.lng;
				window.profileSettingMap.setView([window.lat, window.lng], 13);
				$('button[data-hide="locationsel"]').prop('disabled', false);
			});
	},
	
	updateProfile: function() {
		
		$this = this;
		
		$('.loading').css('visibility','visible');
		
		var updateDetails = function() {
			if ($this.profileupload == true && $this.coverupload == true) {
				var update = {
					aggid: $this.model.get("aggid"),
					profileimg: $this.profileimg != null ? $this.profileimg : $this.model.get("profileimg"),
					coverimg: $this.coverimg != null ? $this.coverimg : $this.model.get("coverimg"),
					photoURL: $this.photoURL,
					name: {
						first: $('input[name="user-firstnamesetting"]').val(),
						last: $('input[name="user-lastnamesetting"]').val(),
					},
					description: $('[name="user-descriptionsetting"]').val(),
					location: {
						normal: window.normal,
						lat: window.lat,
						lng: window.lng
					},
					social: {
						facebook: $('input[name="user-facebookurl"]').val() != (null || "None set...") ? $('input[name="user-facebookurl"]').val() : null,
						twitter:$('input[name="user-twitterurl"]').val() != (null || "None set...") ? $('input[name="user-twitterurl"]').val(): null,
						pinterest: $('input[name="user-pinteresturl"]').val() != (null || "None set...") ? $('input[name="user-pinteresturl"]').val() : null
					}
				};
				console.log(update);
				$.ajax({
					url: '/accounts',
					type: 'PUT',
					data: {
						update: update,
					}
				}).done(function() {
					$this.profileupload == false;
					$this.coverupload == false;
					alert("Updated!");
					$this.model.fetch();
				}).fail(function() {
				});
				$.ajax({
					url: '/experience/userid/' + $this.model.get("aggid"),
					type: 'PUT',
					data: {
						update: {
							creator: update
						},
					}
				}).done(function() {
				}).fail(function() {
				});
			}
		}
		
		if ($this.profileupload == false) {
		  
		  var profileq =  $this.profileimg.size > 250000 ? Math.floor((250000 / $this.profileimg.size) * 150 ) : 100;
		  time = new Date();
		  var profilePath = 'users/' + window.user.get('aggid') + '/profileimgs/' + time.getTime() + '.jpg';
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
				$this.profileimg = "https://d2qjfe4gq0m6av.cloudfront.net/" + profilePath;
				
				$this.profileupload = true;
				updateDetails();
			  });
		}
		if ($this.coverupload == false) {
			
			var coverq =  $this.coverimg.size > 500000 ? Math.floor((500000 / $this.coverimg.size) * 150 ) : 100;
			
			var time = new Date();
			var coverPath = 'users/' + window.user.get('aggid') + '/coverimgs/' + time.getTime() + '.jpg'
			  filepicker.convert(
				  $this.coverimg, 
				  {
					  crop: window.coverCrop,
					  quality: coverq
				  }, 
				  {
					  path: '/'+coverPath,
					  format: 'jpg', 
					  mimetype: 'image/jpeg', access: 'public'
				  }, 
				  function(storedCover) {
				  	
					filepicker.remove($this.coverimg);
					$this.coverimg = "https://d2qjfe4gq0m6av.cloudfront.net/" + coverPath;
					
					$this.coverupload = true;
					updateDetails();
			});
		}
		else if ($this.coverupload == true && $this.profileupload == true) {
			updateDetails();
		}
	},
	
	deleteNotification: function( e ) {
		e.preventDefault();
		$.ajax({
			url: '/notifications/' + $(e.currentTarget).data("id"),
			type: 'DELETE'
		}).done(function() {
			$(e.currentTarget.parentElement).fadeOut('slow');
			var remaining = $('.notifcount').text();
			$('.notifcount').text(remaining - 1);
			if ($('.notifcount').text() == 0) {
				$('.notifcount').remove();
				window.notifs.reset();
				$('.notifcol').text("Sorry, no notifications to display!");
			}
		}).fail(function(){
			alert("Doh! There was an error - sorry about that!");
		});
	},
	
	deleteMessage: function( e ) {
		
		$this = this;
		
		var delConfirm = confirm("Are you sure you want to delete this message?")
			if (delConfirm == true) {
				e.preventDefault();
				$.ajax({
					url: '/message/' + $(e.currentTarget).data("id"),
					type: 'DELETE'
				}).done(function() {
					$(e.currentTarget.parentElement).fadeOut('slow');
					var remaining = $('.msgcount').text();
					if ($('.notification[data-msgid="' + $(e.currentTarget).data("id") + '"]')) {
						$.ajax({
							url: '/notifications/' + $('.notification[data-msgid="' + $(e.currentTarget).data("id") + '"]').data("id"),
							type: 'DELETE'
						}).done(function() {
							$('.notification[data-msgid="' + $(e.currentTarget).data("id") + '"]').fadeOut('slow');
							var remaining = $('.notifcount').text();
							$('.notifcount').text(remaining - 1);
							if ($('.notifcount').text() == 0) {
								$('.notifcount').remove();
								window.notifs.reset();
								$('.notifcol').text("Sorry, no notifications to display!");
							}
						}).fail(function(){
							alert("Doh! There was an error - sorry about that!");
						});
					}
					$('.msgcount').text(remaining - 1);
					if ($('.msgcount').text() == 0) {
						$('.msgcount').remove();
						window.notifs.reset();
						$('.messagecol').text("Sorry, no messages to display!");
					}
				}).fail(function(){
					alert("Doh! There was an error - sorry about that!");
				});
			}
	},
	
	onRender: function() {
		
		$this = this;
		
		if (this.model.get("aggid") != undefined) {
			$.ajax({
					url: '/notifications/' + this.model.get("aggid"),
					type: 'GET'
				}).done(function(data) {
					if (data.length <= 0) {
						$('.notifcol').text("Sorry, no notifications to display!");
					}
					else {
						this.notifCollection = Backbone.Collection.extend();
						
						window.notifs = new this.notifCollection;
						
						this.notifications = new notificationsView({collection: window.notifs, el: '.notifcol'});
						
						if (data.length > 0) {
							$('.notifcount').fadeIn('fast');
							$('.notifcount').text(data.length);
						}
						
						for (i=0;i < data.length; i++) {
							var notif = new notificationModel;
							notif.set(data[i]);
							window.notifs.add(notif);
						}
					}
				
				}).fail(function() {
					$('.mybookingscol').text("Sorry, there was an error retrieving your notifications.");
				});
			}
			
			if (this.model.get("aggid") != undefined) {
			$.ajax({
					url: '/bookings/' + this.model.get("aggid"),
					type: 'GET'
				}).done(function(data) {
					if (data.length <= 0) {
						$('.mybookingscol').text("Sorry, you have not yet made any bookings yet!");
					}
					else {
						this.bookingsCollection = Backbone.Collection.extend();
						
						window.bookings = new this.bookingsCollection;
						
						this.bookings = new bookingsView({collection: window.bookings, el: '.mybookingscol'});
						
						if (data.length > 0) {
							$('.bookingcount').fadeIn('fast');
							$('.bookingcount').text(data.length);
						}
						
						for (i=0;i < data.length; i++) {
							var booking = new bookingModel;
							booking.set(data[i]);
							window.bookings.add(booking);
						}
					}
				}).fail(function() {
					$('.mybookingscol').text("Sorry, there was an error retrieving your bookings.");
				});
			}
	
		if (this.model.get("aggid") != undefined) {
			$.ajax({
					url: '/experience/userid/' + this.model.get("aggid"),
					type: 'GET'
				}).done(function(data) {
					if (data.length <= 0) {
						$('.myexperiencescol .xps').text("Sorry, you have not created an experience yet.");
					}
					else {
						this.xpCollection = Backbone.Collection.extend();
						
						window.xps = new this.xpCollection;
						
						this.experiences = new experiencesView({collection: window.xps, el: '.myexperiencescol .xps'});
						
						for (i=0;i < data.length; i++) {
							var xp = new experienceModel;
							xp.set(data[i]);
							window.xps.add(xp);
						}
					}
				}).fail(function() {
					// ADD FAILSAFE!!
				});
			}
			
		if (this.model.get("aggid") != undefined) {
			$.ajax({
					url: '/hearts/' + this.model.get("aggid"),
					type: 'GET'
				}).done(function(data) {
					if (data.length <= 0) {
						$('.myheartscol').text("Sorry, you have not hearted any experience yet!");
					}
					else {
						this.heartCollection = Backbone.Collection.extend();
						
						window.hrts = new this.heartCollection;
						
						this.hearts = new heartsView({collection: window.hrts, el: '.myheartscol'});
						
						for (i=0;i < data.length; i++) {
							var hrt = new heartModel;
							hrt.set(data[i]);
							window.hrts.add(hrt);
						}
					}
				}).fail(function() {
					// ADD FAILSAFE!!
				});
			}		 
		
		if (this.model.get("aggid") != undefined) {
			$.ajax({
					url: '/messages/' + this.model.get("aggid"),
					type: 'GET'
				}).done(function(data) {

					if (data.length <= 0) {
						$('.messagecol').text("Sorry, no messages to display!");
					}
					else {
						this.messageCollection = Backbone.Collection.extend();
						
						window.msgs = new this.messageCollection;
						
						this.messages = new messagesView({collection: window.msgs, el: '.messagecol'});
						
						if (data.length > 0) {
							$('.msgcount').fadeIn('fast');
							$('.msgcount').text(data.length);
						}

						for (i=0;i < data.length; i++) {
							var msg = new messageModel;
							msg.set(data[i]);
							window.msgs.add(msg);
						}
					}
				}).fail(function() {
					// ADD FAILSAFE!!
				});
			}	
			
		}
		
	});
	
	return DashboardLayout;
})