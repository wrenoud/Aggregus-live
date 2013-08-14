define(['tpl!templates/dashboard/experience.tmpl', 'vent'], function ( experience, vent ) {
	
	ExperienceView = Backbone.Marionette.ItemView.extend({
	  template: experience,
	  
	  events: {
		  'click .experience .delete':'deleteExp',
		  'click .editxp':'editXP'
	  },
	  
	  editXP: function( e ) {
		  vent.editxp = this.model.get('aggid');
		  vent.trigger("pages:editxp");
	  },
	  
	  deleteExp: function( e ) {
		  var delConfirm = confirm("Are you sure you want to delete this experience? You cannot reverse this decision!");
		  if (delConfirm == true) {
		  $.ajax({
			  url: '/experience/' + this.model.get("aggid"),
			  type: 'DELETE',
		  }).done(function() {
			  $(e.currentTarget.parentElement).fadeOut('slow');
		  }).fail(function() {
		  });
		  }
	  }
	  
	});
	
	return ExperienceView;
	
});