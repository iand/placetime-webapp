Application.Admin.View.ItemBrief = Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    className: 'profile-item-brief',

    template: {
        type: 'handlebars',
        template: JST['item-brief']
    }
});