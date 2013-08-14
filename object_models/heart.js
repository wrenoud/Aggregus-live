module.exports = function(mongoose, email) {
	
	var HeartSchema = new mongoose.Schema({
	  aggid: {type: String},
	  creator: {type: String},
	  experience: {
		  profileimg: {type: String},
		  name: {type: String},
		  aggid: {type: String}
	  },
	  date: {type: String}
  	});	
	
	var Heart = mongoose.model('Heart', HeartSchema);
	
	var create = function(heart, callback) {
		var heart = new Heart(heart);
		
		heart.save(function( err ) {
			if (err) {
				callback(500);
			}
			else {
				callback(200);
			}
		});
	};
	
	var del = function(heart, callback) {
		Heart.remove({aggid: heart}, function( e ) {
			if ( e ) {
				callback(500);
			}
			else {
				callback(200);
			}
		});
	};
	
	var getByUserId = function(userid, callback) {
		Heart.find( {creator: userid} , function(err, doc) {
			if (err) {
				callback(500);
			}
			else if (doc) {
				callback(200, doc);
			}
		});
	};
	
	return {
	  Heart: Heart,
	  create: create,
	  del: del,
	  getByUserId: getByUserId,
	  }
	
}