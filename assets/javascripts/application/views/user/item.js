Application.View.Item = Backbone.Marionette.ItemView.extend({
    template: '#item-template',
    className: 'item',

    remove: function() {
        this.$el.animate({
            opacity: 0,
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginBottom: 0
        }, 'slow', function () {
            $(this).remove();
        });

        this.stopListening();

        return this;
    },

    onBeforeRender: function() {
        this.$el.css({
            opacity: 0,
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginBottom: 0
        });
    },

    onRender: function() {
        this.$el.animate({
            height: 140,
            opacity: 1,
            paddingTop: 15,
            paddingBottom: 15,
            marginBottom: 7
        }, 'slow');
    }
});