Application.View.TimelineProfile = Backbone.Marionette.ItemView.extend({
    className: 'item item-profile',


    events: {
        'click .flag': 'flag',
        'click .button-unfollow': 'unfollow',
        'click .button-follow': 'follow'
    },


    modelEvents: {
        'flagged': 'onFlagged',
        'followed': 'onFollowed',
        'unfollowed': 'onUnfollowed'
    },


    attributes: function() {
        return {
            'data-pid': this.model.get('pid')
        };
    },


    flag: function(event) {
        this.model.flag();

        return false;
    },


    follow: function(event) {
        this.model.follow();

        return false;
    },


    unfollow: function(event) {
        this.model.unfollow();

        return false;
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
        // this.$el.addClass('collapsed');
    },



    onShow: function() {
        this.$el.offset(); // Trigger repaint
        this.$el.removeClass('collapsed');
    },


    onRender: function() {
        this.$el.data('model', this.model);
    },


    onFlagged: function() {
        this.$el.addClass('is-flagged');
    },


    onFollowed: function() {
        this.$el.addClass('is-followed');
    },


    onUnfollowed: function() {
        this.$el.addClass('is-unfollowed');
    }
});