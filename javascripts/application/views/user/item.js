Application.View.Item = Backbone.Marionette.ItemView.extend({
    template: '#item-template',

    modelEvents: {
        'item:promoted': 'onPromoted'
    },

    templateHelpers: {
        isEvent: function(ts, event) {
            return Application.Model.Item.prototype.isEvent.apply(
                new Backbone.Model({
                    ts: ts,
                    event: event
                })
            );
        },

        time: function(ts) {
            return Application.Model.Item.prototype.time.apply(
                new Backbone.Model({
                    ts: ts
                })
            );
        }
    },

    attributes: function() {
        var attributes = {
            'data-id': this.model.id
        };

        if (this.model.get('image')) {
            attributes.style = 'background-image: url(/-img/' + this.model.get('image') + ')';
        }

        return attributes;
    },


    className: function() {
        var className = 'item collapsed';

        if (this.model.get('image')) {
            className += ' image';
        }

        if (this.model.get('event') == this.model.get('ts').toString().substr(0, 10)) {
            className += ' event';
        }

        return className;
    },

    onPromoted: function() {
        this.$el.removeClass('now').addClass('promoted');
    },


    onShow: function() {
        this.$el.offset();
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