define(['tpl!templates/dashboard/booking_nonuser.tmpl', 'tpl!templates/dashboard/booking_user.tmpl', 'stripe', 'vent'], function ( booking_nonuser, booking_user, stripe, vent ) {
	BookingView = Backbone.Marionette.ItemView.extend({
	  template: booking_nonuser,
	  
	  events: {
	  	'click .confirm':'confirmBooking',
		'click .cancelbooking':'cancelBooking',
		'click .messagehost':'messagehost',
		'click .viewbooking':'viewbooking'
	  },
	  
	  onRender: function() {
	  },
	  
	  onBeforeRender: function() {
		if (this.model.get('booker').aggid == window.user.get('aggid')) {
			this.template = booking_user;
		}
		else {
			this.template = booking_nonuser;
		}
	  },
	  
	  cancelBooking: function() {
		  var yesCancel = confirm("Are you sure you wish to cancel this booking?");
		  if (yesCancel == true) {
			  alert("You've cancelled this booking. We will refund your guest - please send them a message will details as to your cancellation, and if possible, arrange a date in the future.");
		  }
	  },
	  
	  confirmBooking: function( e ) {
		 var $this = this;
		 if ($this.model.get("confirmed") == true) {
			 alert("You've alredy confirmed this experience!");
			 return false;
		 }
		 var totalPrice = this.model.get("totalPrice")
		 var booking = $(e.currentTarget).data("id");
		 var bookingConfirm = confirm("Are you sure you want to confirm this booking?")
		 if (bookingConfirm == true) {
			 $.ajax({
				 url:'/charge',
				 type:'POST',
				 data: {
					 token: this.model.get("token"),
					 price: this.model.get("totalPrice") * 100
				 }
			 }).done(function() {
				 
				 alert("Thank you for confirming! Be sure to follow up with you guest if you have any specific instructions.");
				 
				 var notif = {
					  aggid: "notif" + (new Date).getTime() + Math.floor((Math.random() + 1) * 5000),
					  type: "booking.attendee",
					  action: null,
					  experience: {
						  name: $this.model.get("experience").name,
						  aggid: $this.model.get("experience").aggid
					  },
					  recipient: $this.model.get("booker").aggid,
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
				  
				 $.ajax({
					 url:'/booking/' + $this.model.get("aggid"),
					 type: 'PUT',
					 data: {
						 data: {
							 confirmed: true
						 }
					 }
				 }).done(function() {
				 }).fail(function() {
				 });
				 
				 $.ajax({
					 url:'/accounts',
					 type: 'PUT',
					 data: {
						 update: {
							 balanceOwed: window.user.get("balanceOwed") + totalPrice
						 }
					 }
				 }).done(function() {
					 Backbone.history.navigate("dashboard");
				 }).fail(function() {
				 });
				 
			 }).fail(function() { 
			 });
		 }
	  },
	  
	  messagehost: function( e ) {
		  vent.sender = window.user.get('aggid');
		  vent.sendto = $(e.currentTarget).data("id");
			vent.trigger('show:messenger');
				$('.modalwindow').animate({
					'height':'450px'
				}, 200, function() {
				$('.messenger').fadeIn('slow')
				});
	  },
	  
	  viewbooking: function() {
		$this = this; 
	  	vent.trigger('show:booking');
		
		var guestname = $('.booking span[name="guestname"]');
		var totalguests = $('.booking span[name="totalguests"]');
		var datedesired = $('.booking span[name="datedesired"]');
		var timedesired = $('.booking span[name="timedesired"]');
		var status = $('.booking span[name="status"]');
		var guestimage = $('.booking img[name="guestimage"]');
		var profit = $('.booking span[name="profit"]');

		guestname.text("Guest Name: " + $this.model.get("booker").name.first + " " + $this.model.get("booker").name.last);
		totalguests.text("Total Guests: " + $this.model.get("attendees"));
		datedesired.text("Date Booked: " + $this.model.get("dateBooked").date);
		timedesired.text("Time Booked: " + window.clock[$this.model.get("dateBooked").time * 2]);
		status.html("Status: " + ($this.model.get("confirmed") ? "<font color='green'>Confirmed</font>" : "<font color='red'>Not Yet Confirmed</font>"));
		guestimage.attr("src", $this.model.get("booker").profileimg);
		profit.text("Your Profit: $" + $this.model.get("hostProfit") );
	  }
	  
	  });
	
	return BookingView;
	
});