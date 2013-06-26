Application.View.NoResults = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['no-results']
    },
    className: 'no-results'
});