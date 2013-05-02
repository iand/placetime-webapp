Application.View.Search = Backbone.Marionette.ItemView.extend({
    template: '#search-template',

    modelEvents: {
        'item:promoted': 'onPromoted'
    },

    className: 'item collapsed',


    onShow: function() {
        this.$el.offset();
        this.$el.removeClass('collapsed');
    },


    remove: function() {
        var self = this,
            args = arguments;

        this.$el.transitionEnd(function(event) {
            // Prevent triggering multiple times
            if (event.propertyName !== 'max-height') {
                return;
            }

            Backbone.Marionette.ItemView.prototype.remove.apply(self, args);
        });
        this.$el.addClass('collapsed');
    }
});