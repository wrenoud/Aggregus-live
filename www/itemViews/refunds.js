define(['tpl!templates/terms.tmpl','vent'], function (terms, vent) {
	termsView = Backbone.Marionette.ItemView.extend({
		
	template: terms,
	
	onRender: function() {
		$('body').removeClass('nooverflow');
		$.ajax({
			url: '/refunds',
			type:'GET'
		}).done(function( refunds ){
			$('.terms').html( refunds );
		}).fail(function() {
		});
	},
	
	initialize: function() {
		$('body').removeClass('nooverflow');
	}
	
	});
	
	return termsView;
})