Application.Admin.View.FeedList = Backbone.Marionette.CompositeView.extend({
    template: {
        type: 'handlebars',
        template: JST['feeds']
    },
    itemView: Application.Admin.View.FeedBrief
});