define(['tpl!templates/terms.tmpl','vent'], function (terms, vent) {
	termsView = Backbone.Marionette.ItemView.extend({
		
	template: terms,
	
	onRender: function() {
		$('body').removeClass('nooverflow');
		$.ajax({
			url: '/privacy',
			type:'GET'
		}).done(function( privacy ){
			$('.terms').html( privacy );
		}).fail(function() {
		});
	},
	
	initialize: function() {
		$('body').removeClass('nooverflow');
	}
	
	});
	
	return termsView;
})