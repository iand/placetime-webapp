Application.View.TimelineItem = Backbone.Marionette.ItemView.extend({
    events: {
        'click .flag': 'flag',
        'click .button-add': 'add',
        'click .button-promote': 'promote',
        'click .button-demote': 'demote',
        'click .audio': 'load'
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


    load: function() {
        // Unbind to prevent double click
        this.$el.off('click.delegateEvents' + this.cid, '.audio');

        var $text = this.$el.find('.item-text'),
            $time = this.$el.find('.time'),
            $duration = this.$el.find('.duration');

        var $iframe = $('<iframe />');
            $iframe.addClass('item-listen collapsed');
            $iframe.attr({
                src: Application.Helpers.getSpotifyUrl(this.model.get('link')),
                height: 80,
                frameborder: 0,
                allowtransparency: true,
                width: 680
            });

        // TODO: Add pid === user when pid is equal to promoting user
        if (this.model.get('status') === 'm') {
            $iframe.attr('width', 420);
        } else {
            $iframe.attr('width', 680);
        }

        $iframe.insertAfter($text);

        $text.addClass('collapsed');
        $duration.addClass('collapsed');
        $iframe.removeClass('collapsed');

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
        this.$el.addClass('collapsed');
    },


    flag: function(event) {
        this.model.flag();

        return false;
    },


    add: function() {
        this.model.add();

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


    onRender: function() {
        this.$el.data('model', this.model);
    }
});