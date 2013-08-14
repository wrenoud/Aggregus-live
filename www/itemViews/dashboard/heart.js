define(['tpl!templates/dashboard/heart.tmpl', 'vent'], function ( heart, vent ) {
	HeartView = Backbone.Marionette.ItemView.extend({
	  
	  template: heart,
	  
	  events: {
		  'click .heart .delete':'deleteHeart'
	  },
	  
	  deleteHeart: function( e ) {
		var delConfirm = confirm("Are you sure you want to delete this heart?");
			if (delConfirm == true) {
			$.ajax({
				url: 'heart/' + this.model.get("aggid"),
				type: 'DELETE',
			}).done(function() {
				$(e.currentTarget.parentElement).fadeOut('slow');
			}).fail(function() {
				alert("Could not delete heart.");
			});
		  }
	  }
	  
	   });
	
	return HeartView;
	
});