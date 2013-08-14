define(['itemViews/dashboard/experience'], function(experience) {
	
	xpCollectionView = Backbone.Marionette.CollectionView.extend({
		itemView: experience,
		
		initialize: function() {
			this.collection.on("add", this.render, this)
		},
		
		render: function() {
			// For some reason, simply defining this render() function dispels an issue of the first notification double displaying. Hmm.....
		}
	});
	
	return xpCollectionView;
	
});