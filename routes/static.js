module.exports = function(app, crypto, User, Notifications, Experience, Booking, Review, Heart, Message, email) {
  app.get('/experience/:id', function(req, res) {
	  Experience.getById(req.params.id, function( status, experience ) {
		  if ( status == 200 ) {
			  res.render('../views/experience.jade', experience);
		  }
		  else {
			  res.render('./views/404/experience.jade');
		  }
	  });
  })
  
  app.get('/profile/:id', function(req, res) {
	  User.getById({aggid: req.params.id}, function( status, user ) {
		  if (status == 200) {
			  res.render('./views/profile.jade', user);
		  }
		  else {
			  res.render('./views/404/profile.jade');
		  }
	});
  })
  
  app.get('/learnmore', function(req, res) {
	  res.render('./views/learnmore.jade');	
  })
  
  app.get('/privacy', function(req, res) {
	  res.render('./views/privacy.jade');	
  })
  
  app.get('/refunds', function(req, res) {
	  res.render('./views/refunds.jade');	
  })
  
  app.get('/terms', function(req, res) {
	  res.render('./views/terms.jade');	
  })
}