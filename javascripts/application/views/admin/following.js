Application.Admin.View.Following = Backbone.Marionette.CollectionView.extend({
    template: '#following-tmpl',
    itemView: Application.View.ProfileBrief
});