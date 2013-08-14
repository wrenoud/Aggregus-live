define(['itemViews/dashboard/booking'], function(booking) {
	
	bookingCollectionView = Backbone.Marionette.CollectionView.extend({
		itemView: booking,
		
		initialize: function() {
			this.collection.on("add", this.render, this)
		},
		
		render: function() {
			// For some reason, simply defining this render() function dispels an issue of the first notification double displaying. Hmm.....
		}
	});
	
	return bookingCollectionView;
	
});