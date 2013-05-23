Application.View.TimelineItem = Backbone.Marionette.ItemView.extend({
    events: {
        'click .flag': 'flag',
        'click .promote': 'promote',
        'click .demote': 'demote'
    },

    modelEvents: {
        'flagged'       : 'onFlagged',
        'item:promoted' : 'onPromoted',
        'item:demoted'  : 'onDemoted'
    },


    attributes: function() {
        var attributes = {
            'data-id': this.model.id
        };

        if (this.model.get('image')) {
            if (/^https?/.test(this.model.get('image')) === true) {
                attributes.style = 'background-image: url(' + this.model.get('image') + ')';
            } else {
                attributes.style = 'background-image: url(/-img/' + this.model.get('image') + ')';
            }
        }

        return attributes;
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
    },


    flag: function(event) {
        this.model.flag();

        return false;
    },


    promote: function () {
        this.model.promote();

        return false;
    },


    demote: function () {
        this.model.demote();

        return false;
    },


    onFlagged: function() {
        this.$el.addClass('flagged');
    },


    onPromoted: function() {
        this.$el.removeClass('now').addClass('promoted');
    },


    onDemoted: function() {

    },


    onShow: function() {
        this.$el.offset();
        this.$el.removeClass('collapsed');
    },


    onRender: function() {
        this.$el.data('model', this.model);
    }
});