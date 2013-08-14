module.exports = function(mandrill) {
	
var clock = ["12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM", "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM" ,"8:00 AM" ,"8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",];

var welcome = function( user ) {
	mandrill('/messages/send-template', {
		template_name: "Confirmation",
		template_content: [
			{
				"name":"firstname",
				"content":"Welcome to Aggregus, " + user.name.first + "!"
			},
			{
				"name":"confirmcode",
				"content":"<a href='https://www.aggregus.com/#confirm/" + user.aggid + "/" + user.emailconfirm + "'>https://www.aggregus.com/#confirm/" + user.aggid + "/" + user.emailconfirm + "</a>"
			}
		],
		message: {
			to: [{email: user.email, name: user.name.first + " " + user.name.last}],
			bcc_address: 'team@aggregus.com',
			from_email: 'welcome@aggregus.com',
			subject: "Welcome to Aggregus!",
			text: "Welcome to Aggregus!"
		}
	}, function(error, response)
	{
		if (error) {
			console.log(error);
		}
	});
}

var resetPassword = function( user, resetPassId ) {
	mandrill('/messages/send-template', {
		template_name: "resetPassword",
		template_content: [
			{
				"name":"firstname",
				"content":"Ah snap, " + user.name.first + "!"
			},
			{
				"name":"resetcode",
				"content":"<a href='https://www.aggregus.com/#resetpassword/" + user.aggid + "/" + resetPassId + "'>https://www.aggregus.com/#resetPassword/" + user.aggid + "/" + resetPassId + "</a>"
			}
		],
		message: {
			to: [{email: user.email, name: user.name.first + " " + user.name.last}],
			bcc_address: 'team@aggregus.com',
			from_email: 'resetpassword@aggregus.com',
			subject: "Aggregus Account Password Reset",
			text: "Let's reset your password!"
		}
	}, function(error, response)
	{
		if (error) {
			console.log(error);
		}
	});
}

var messageReceived = function( message, user ) {
	mandrill('/messages/send-template', {
		template_name: "messageReceived",
		template_content: [
			{
				"name":"firstname",
				"content":message.sender.name.first+" " +message.sender.name.last+" has sent you a message on Aggregus!"
			},
			{
				"name":"main",
				"content":"<p></p><span>At " + message.dateSent + " " + message.sender.name.first + " wrote:</span><p><b>Subject: "+message.subject+"</b></p><p>"+ message.content +"</p>."
			}
		],
		message: {
			to: [{email: user.email, name: user.name.first + " " + user.name.last}],
			bcc_address: 'team@aggregus.com',
			from_email: 'messages@aggregus.com',
			subject : message.sender.name.first +" has sent you a message on Aggregus!",
			text: "You've been sent a message!"
		}
	}, function(error, response)
	{
		if (error) {
			console.log(error);
		}
	});
}

var bookingCreated = function( booking ) {
	mandrill('/messages/send-template', {
		template_name: "bookingCreated",
		template_content: [
			{
				"name":"firstname",
				"content":"Hey "+booking.booker.name.first+"!<p>Your booking for <a href='/#experience/"+booking.experience.aggid+"'>" + booking.experience.name + "</a> has been sent!"
			},
			{
				"name":"main",
				"content":"<p>Specific details for your booking are as follows:</p><p></p><span>Experience Name: <a href='/#experience/"+booking.experience.aggid+"'>"+booking.experience.name +"</a></span><br/><span>Date:  "+ booking.dateBooked.date +"</span><br/><span>Time:  "+clock[booking.dateBooked.time*2]+"</span><br/><span># of Attendees:  "+booking.attendees+"</span><br /><span>Total Cost:  $"+booking.totalPrice+"</span><br/><p>Your host, "+booking.experience.creator.name.first+" "+booking.experience.creator.name.last+", still needs to confirm that the date and time you specified are doable, then you're home free. We'll email you once they confirm.</p><p>In the meantime, <b>"+booking.experience.creator.name.first+" has given us some additional instructions to pass along to you:</b> </p><p>"+booking.guestInstructions+"</p>"
			}			
		],
		message: {
			to: [{email: booking.booker.email, name: booking.booker.name.first + " " + booking.booker.name.last}],
			bcc_address: 'team@aggregus.com',
			from_email: 'bookings@aggregus.com',
			subject: "Your booking for "+booking.experience.name+" has been sent!",
			text: "Your booking has been sent!"
		}
	}, function(error, response)
	{
		if (error) {
			console.log(error);
		}
	});
}

var bookingReceived = function( booking ) {
	mandrill('/messages/send-template', {
		template_name: "bookingReceived",
		template_content: [
			{
				"name":"firstname",
				"content":"Your experience, "+booking.experience.name+", has been booked on Aggregus!"
			},
			{
				"name":"main",
				"content":"<p>Specific details for your booking are as follows:</p><p></p><span>Guest Name: "+booking.booker.name.first + " " +booking.booker.name.last +"</span><br/><span>Date:  "+ booking.dateBooked.date +"</span><br/><span>Time:  "+clock[booking.dateBooked.time*2]+"</span><br/><span># of Attendees:  "+booking.attendees+"</span><br /><span>Total Cost:  "+booking.totalPrice+"</span><br/><p>Log onto your account to confirm this booking. If you are unable to host this booking, please ensure that you notify the guests via message before deleting their booking. </p>"
			}
		],
		message: {
			to: [{email: booking.experience.creator.email, name: booking.experience.creator.name.first + " " + booking.experience.creator.name.last}],
			bcc_address: 'team@aggregus.com',
			from_email: 'bookings@aggregus.com',
			subject: "Your experience, "+booking.experience.name+", has been booked on Aggregus!",
			text: "Your experience has been booked!"
		}
	}, function(error, response)
	{
		if (error) {
			console.log(error);
		}
		else {
		}
	});
}

var bookingConfirmed = function( booking ) {
	mandrill('/messages/send-template', {
		template_name: "bookingConfirmed",
		template_content: [
			{
				"name":"firstname",
				"content":"Your booking to experience "+ booking.experience.name + " has been confirmed!"
			},
			{
				"name":"main",
				"content":"<p>That's awesome news "+booking.booker.name.first+"!</p> Feel free to message your host if you have any questions, and once again, here are the specific details for your booking: <p></p><span>Experience Name: "+booking.experience.name +"</span><br/><span>Date:  "+ booking.dateBooked.date +"</span><br/><span>Time:  "+clock[booking.dateBooked.time*2]+"</span><br/><span># of Attendees:  "+booking.attendees+"</span><br /><span>Total Cost:  "+booking.totalPrice+"</span><br/>"
			}
		],
		message: {
			to: [{email: booking.booker.email, name: booking.booker.name.first + " " + booking.booker.name.last}],
			bcc_address: 'team@aggregus.com',
			from_email: 'bookings@aggregus.com',
			subject: "Your booking to experience "+booking.experience.name+" has been confirmed!",
			text: "Your experience has been confirmed!"
		}
	}, function(error, response)
	{
		if (error) {
			console.log(error);
		}
	});
}

var experienceCreated = function( experience ) {
	mandrill('/messages/send-template', {
		template_name: "experienceCreated",
		template_content: [
			{
				"name":"firstname",
				"content":"You just created "+ experience.name +" on Aggregus!"
			},
			{
				"name":"main",
				"content":"Thanks for positing on Aggregus! You can manage your experience at any time through the 'My Experiences' portal on your dashboard, and we're look forward to promoting your awesomeness on Aggregus!"
			}
		],
		message: {
			to: [{email: experience.creator.email, name: experience.creator.name.first + " " + experience.creator.name.last}],
			bcc_address: 'team@aggregus.com',
			from_email: 'experiences@aggregus.com',
			subject: "Your experience, "+ experience.name +", has been posted on Aggregus!",
			text: "Your experience has been posted!"
		}
	}, function(error, response)
	{
		if (error) {
			console.log(error);
		}
	});
}

var helpRequest = function( panic, callback ) {
	mandrill('/messages/send', {
		message: {
			to: [{email: "ryan@aggregus.com", name: "Ryan Miller",}],
			from_email: "helperbot@aggregus.com",
			from_Name: "Helperbot",
			subject: panic.name.first + " has sent you a help request!",
			text: "At " + panic.time + " " + panic.name.first + " " + panic.name.last + " (ID: " + panic.userid + " sent you a help request: " + panic.message
		}
	}, function(error, response) {
		if (error) {
			console.log(error);
			callback(500);
		}
		else {
			callback(200);
		}
	})
	
}

var sendRoster = function( guests, user, query, callback ) {
	mandrill('/messages/send-template', {
		template_name: "Roster",
		template_content: [
			{
				"name":"firstname",
				"content":"Hey "+user.name.first+"!<p>"
			},
			{
				"name":"info",
				"content":"We're passing along the roster for all bookings for your experience <a href='https://www.aggregus.com/#experience/"+query.experience.aggid+"'>" +query.experience.name + "</a> on " + query.date + ". Let us know if you need any additional information!<p>"
			},
			{
				"name":"roster",
				"content":guests
			}
		],
		message: {
			to: [{email: user.email, name: user.name.first + " " + user.name.last}],
			bcc_address: 'team@aggregus.com',
			from_email: 'experiences@aggregus.com',
			subject: "Roster for Experience "+ query.experience.name +" on "+query.date+"",
			text: "Here's your roster!"
		}
	}, function(error, response)
	{
		if (error) {
			console.log(error);
			callback(500);
		}
		else {
			callback(200);
		}
	});
}

return {
	welcome: welcome,
	resetPassword: resetPassword,
	bookingReceived: bookingReceived,
	bookingCreated: bookingCreated,
	bookingConfirmed: bookingConfirmed,
	experienceCreated: experienceCreated,
	messageReceived: messageReceived,
	helpRequest: helpRequest,
	sendRoster: sendRoster
}

}