Application.View.Follower = Backbone.Marionette.ItemView.extend({
    template: '#follower-template',
    className: 'item collapsed',

    attributes: function() {
        return {
            'data-pid': this.model.get('pid')
        };
    },


    onShow: function() {
        this.$el.offset(); // Trigger repaint
        this.$el.removeClass('collapsed');
    },


    onRender: function() {
        this.$el.data('model', this.model);
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