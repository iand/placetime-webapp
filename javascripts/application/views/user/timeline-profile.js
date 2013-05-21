Application.View.TimelineProfile = Backbone.Marionette.ItemView.extend({
    className: 'item collapsed',

    attributes: function() {
        return {
            'data-pid': this.model.get('pid')
        };
    },


    events: {
        'click .unfollow': 'unfollow',
        'click .follow': 'follow'
    },


    modelEvents: {
        'followed': 'onFollowed',
        'unfollowed': 'onUnfollowed'
    },


    onShow: function() {
        this.$el.offset(); // Trigger repaint
        this.$el.removeClass('collapsed');
    },


    onRender: function() {
        this.$el.data('model', this.model);
    },


    onFollowed: function() {
        this.$el.addClass('followed');
    },


    onUnfollowed: function() {},



    follow: function(event) {
        this.model.follow();
    },


    unfollow: function(event) {
        this.model.unfollow();
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