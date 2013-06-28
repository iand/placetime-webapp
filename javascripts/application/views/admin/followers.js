Application.Admin.View.Followers = Backbone.Marionette.CollectionView.extend({
    template: {
        type: 'handlebars',
        template: JST['followers']
    },
    itemView: Application.Admin.View.FollowerBrief
});