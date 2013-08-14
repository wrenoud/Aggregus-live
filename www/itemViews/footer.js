define(['tpl!templates/footer.tmpl', 'vent', 'hoverIntent'], function (footer, vent, hoverIntent) {
	FooterView = Backbone.Marionette.ItemView.extend({
	  template: footer,
	  
	  events: {
	  },
	  
	  onRender: function() {
		  var caps = function(string) {
			  return string.charAt(0).toUpperCase() + string.slice(1);
		  };
		  
			$('#footer').hoverIntent(
				function() {
				$('#footer').animate({'width':'100%'}, 250);
				$('#footer .options div').hoverIntent(function( evt ) {
					$('#footer .title').text(caps($(evt.currentTarget).data("id")));
				});
				}, 
	  
				function() {
				$('#footer').animate({'width':'50px'}, 250);});
				} 
	});
	
	return FooterView;

});