Application.Admin.View.Followers = Backbone.Marionette.CollectionView.extend({
    template: '#followers-tmpl',
    itemView: Application.Admin.View.FollowerBrief
});