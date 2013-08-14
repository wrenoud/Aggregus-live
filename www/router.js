define(['router.controller'], function(controller) {
	
	var Router = Marionette.AppRouter.extend({
	
		appRoutes: {
			'index':'index',
			'confirm/:aggid/:code':'confirmaccount',
			'resetpassword/:aggid/:code':'resetpassword',
			'profile/:aggid':'profile',
			'experience/:aggid':'experience',
			'experiences':'experiences',
			'introduction':'introduction',
			'create':'create',
			'terms':'terms',
			'privacy':'privacy',
			'refunds':'refunds',
			'dashboard':'dashboard',
			'learnmore':'learnmore',
			'*path':'defaultRoute'
		},
		
		controller: controller
	
	});
	
	return new Router;
});