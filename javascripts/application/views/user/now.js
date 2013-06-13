Application.View.Now = Backbone.Marionette.ItemView.extend({
    template: '#now-template',
    className: 'now-separator is-collapsed',


    onRender: function() {
        this.$el.addClass('is-collapsed');
    },

    onShow: function() {
        this.$el.removeClass('is-collapsed');
    }
});