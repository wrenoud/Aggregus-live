define(['itemViews/dashboard/heart'], function(heart) {
	
	heartCollectionView = Backbone.Marionette.CollectionView.extend({
		itemView: heart,
		
		initialize: function() {
			this.collection.on("add", this.render, this)
		},
		
		render: function() {
			// For some reason, simply defining this render() function dispels an issue of the first notification double displaying. Hmm.....
		}
	});
	
	return heartCollectionView;
	
});