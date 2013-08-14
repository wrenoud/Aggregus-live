define(['tpl!templates/terms.tmpl','vent'], function (terms, vent) {
	termsView = Backbone.Marionette.ItemView.extend({
		
	template: terms,
	
	onRender: function() {
		$('body').removeClass('nooverflow');
		$.ajax({
			url: '/static/terms',
			type:'GET'
		}).done(function( terms ){
			$('.terms').html( terms );
		}).fail(function() {
		});
	},
	
	initialize: function() {
		$('body').removeClass('nooverflow');
	}
	
	});
	
	return termsView;
})