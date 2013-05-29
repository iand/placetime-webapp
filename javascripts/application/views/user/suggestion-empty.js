Application.View.SuggestionEmpty = Backbone.Marionette.ItemView.extend({
    template: '#suggestion-empty-template',
    className: 'item empty collapsed',


    modelEvents: {
        'change:loading': 'render'
    },


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