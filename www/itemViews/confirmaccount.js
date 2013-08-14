define(['tpl!templates/confirmaccount.tmpl', 'vent'], function (confirmaccount, vent) {
	ConfirmAccountView = Backbone.Marionette.ItemView.extend({
	  
	  template: confirmaccount,
	
	});
	
	return ConfirmAccountView;
})