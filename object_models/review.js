module.exports = function(mongoose, email) {
	
	var ReviewSchema = new mongoose.Schema({
	  aggid: {type: String},
	  creator: {
		  aggid: {type: String},
		  name: {
			  firstname: {type: String},
			  lastname: {type: String}
		  }
	  },
	  recipient: {
		  host: {type: String},
		  experience: {type: String},
	  },
	  content: {
		  hostReview: {type: String},
		  experienceReview: {type: String},
		  rating: {type: Number}
	  },
	  dateCreated: {type: String}
  	});	
	
	var Review = mongoose.model('Review', ReviewSchema);
	
	return {
	  Review: Review
	  }
	
}// JavaScript Document