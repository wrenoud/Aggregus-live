require.config({
	
	waitSeconds: 20,
	
	paths: {
		jquery: 'lib/jquery',
		underscore: 'lib/underscore',
		backbone: 'lib/backbone',
		marionette: 'lib/marionette',
		facebook: '//connect.facebook.net/en_US/all',
		stripe: 'lib/stripe',
		tpl: 'lib/tpl',
		hoverIntent: 'lib/hoverIntent',
		vent: 'app.vent',
		fullcalendar: 'lib/fullcalendar.min',
		isotope: 'lib/jquery.isotope',
		perfectmasonry: 'lib/jquery.isotope.perfectmasonry',
		filepicker: 'lib/filepicker',
		leaflet: 'lib/leaflet'
	},
	
	shim: {
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone':	{
			deps: ['underscore','jquery'],
			exports: 'Backbone'
		},
		'marionette': {
			deps: ['backbone','underscore','jquery'],
			exports: 'Marionette'
		},
		'facebook' : {
      		export: 'FB'
    	},	
		'app': {
			deps: ['jquery', 'marionette', 'vent'],
			exports: 'app'
		},
		'perfectmasonry': {
			deps: ['isotope']
		},
		'filepicker': {
			exports: 'filepicker'
		},
		'vent': {
			exports: 'vent'
		},
		'leaflet': {
			exports: 'L'
		}
	}		
			
});

require(['app','lib/fb'], function(app) {
	app.start();
});