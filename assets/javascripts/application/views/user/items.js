Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#timeline-private-template',
    className: 'column',

    events: {
        'click .button.promote': 'promote',
        'click .button.demote': 'demote'
    },

    itemViewContainer: '.items',



    initialize: function (options) {
        this.on('composite:collection:rendered', this.rendered);
    },



    rendered: function (eventName) {
        if (this.scroller) {
            this.scroller.destroy();
        }

        this.scroller = new iScroll(this.$el.find('.content-primary').get(0), {
            momentum: true,
            hScrollbar: false,
            vScroll: true
        });

        return this;
    },



    promote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');

        this.on('item:removed', function(event) {
            event.model.promote();
        });

        this.collection.remove(
            $item.data('id')
        );


        return false;
    },



    demote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');


        this.on('item:removed', function(event) {
            event.model.demote();
        });

        this.collection.remove(
            $item.data('id')
        );


        return false;
    },



    buildItemView: function(item, ItemViewType, itemViewOptions) {
        if (this.model.get('status') === 'p') {
            item.set('action', 'promote');
        } else {
            item.set('action', 'demote');
        }

        return new Application.View.Item({
            model: item
        });
    }
});