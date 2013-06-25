Application.View.Now = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['now']
    },
    className: 'now-separator is-collapsed',


    onRender: function() {
        this.$el.addClass('is-collapsed');
    },

    onShow: function() {
        this.$el.removeClass('is-collapsed');
    }
});