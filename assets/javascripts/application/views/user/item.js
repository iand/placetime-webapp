Application.View.Item = Backbone.Marionette.ItemView.extend({
    template: '#item-template',


    destroy: function() {
        if (this.isClosed) {
            return;
        }

        this.triggerMethod('item:before:close');

        var self = this;
        this.$el.animate({opacity: 0, height: 0}, 'slow', function () {
            Marionette.View.prototype.close.apply(
                self,
                Array.prototype.slice.apply(arguments)
            );
        });

        this.triggerMethod('item:closed');
    }
});