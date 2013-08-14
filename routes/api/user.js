module.exports = function(app) {
	console.log("Tier 3");
	app.get('/api/user', function(req, res) {
		res.send("ballers");
		
		var user = req.query;
		
		user.hidden = false;

		User.find(query, {password: 0}, function(err,doc) {
		  	if (doc) {
				callback(200, doc);
			}
			else if (err) {
				callback(500, null);
				console.log(err);
			}
			else {
				callback(404, null);
			}
		});
	});
	
	app.post('/api/user', function(req, res) {
		var user = req.body;
		
		

		//User creation is handled in the Access API.
	});
	
	app.put('/api/user', function(req, res) {
		var user = req.body;

		User.update(
			{_id: user._id}, 
			{
				$set: user,
			}, 
			function(err,doc) {
		  		if (err) {
					callback(500);
					console.log(err);
				}
				else if (doc) {
					callback (200);
				}
				else {
					callback(404);
				}
			});
	});
	
	app.delete('/api/user', function(req, res) {
		var user = req.body;

		User.update(
			{_id: user._id}, 
			{
				$set: {
					hidden: true
				},
			}, 
			function(err,doc) {
		  		if (err) {
					callback(500);
					console.log(err);
				}
				else if (doc) {
					callback (200);
				}
				else {
					callback(404);
				}
			});
		});
}