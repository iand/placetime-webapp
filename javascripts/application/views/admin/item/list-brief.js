Application.Admin.View.ItemListBrief = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'profile-items-brief',
    itemView: Application.Admin.View.ItemBrief,

    initialize: function() {
        this.collection.fetch();
    }
});