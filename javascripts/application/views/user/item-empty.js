Application.View.ItemEmpty = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['item-empty']
    },
    className: 'item item-empty collapsed',



    onShow: function() {
        this.$el.offset();
        this.$el.removeClass('collapsed');
    },



    remove: function() {
        var self = this,
            args = arguments;

        this.$el.transitionEnd(function(event){
            if (event.propertyName !== 'max-height') {
                return;
            }

            Backbone.Marionette.ItemView.prototype.remove.apply(self, args);
        });
        this.$el.addClass('collapsed');
    }
});