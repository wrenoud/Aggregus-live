define(['tpl!templates/learnmore.tmpl','vent'], function (terms, vent) {
	learnmoreView = Backbone.Marionette.ItemView.extend({
		
	template: terms,
	
	onRender: function() {
		$('body').removeClass('nooverflow');
		$.ajax({
			url: '/learnmore',
			type:'GET'
		}).done(function(learnmore){
			$('.learnmore').html(learnmore);
		}).fail(function() {
		});
	},
	
	initialize: function() {
		$('body').removeClass('nooverflow');
	},
	
	});
	
	return learnmoreView;
})