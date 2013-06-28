Application.Admin.View.Followings = Backbone.Marionette.CollectionView.extend({
    template: {
        type: 'handlebars',
        template: JST['followings']
    },
    itemView: Application.View.ProfileBrief
});