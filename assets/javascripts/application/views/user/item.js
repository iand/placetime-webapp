Application.View.Item = Backbone.Marionette.ItemView.extend({
    template: '#item-template',
    className: 'item',

    remove: function() {
        this.$el.animate({
            opacity: 0,
            height: 0,
            marginTop: 0,
            paddingTop: 0,
            marginBottom: 0,
            paddingBottom: 0
        }, 'slow', function () {
            $(this).remove();
        });

        this.stopListening();

        return this;
    },

    beforeRender: function() {
        this.$el.css({
            opacity: 0,
            height: 0
        });
    },

    onRender: function() {
        this.$el.animate({
            height: 150,
            opacity: 1
        }, 'slow');
    }
});