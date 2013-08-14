define(['itemViews/pin'], function(pin) {
	
	pinsCollectionView = Backbone.Marionette.CollectionView.extend({
		itemView: pin,
		
		initialize: function() {
			this.collection.on("add", this.render, this)
		},
		
		render: function() {
			// For some reason, simply defining this render() function dispels an issue of the first notification double displaying. Hmm.....
		}
	});
	
	return pinsCollectionView;
	
});