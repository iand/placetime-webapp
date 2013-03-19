Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#timeline-template',
    className: 'column',

    events: {
        'click .button.promote': 'promote',
        'click .button.demote': 'demote'
    },

    itemViewContainer: '.foo',



    initialize: function (options) {
        var self = this;


        this.on('composite:rendered', this.foo);
        this.on('composite:collection:rendered', this.foo);


        // Adjust scroller height
        $(window).resize(function(){
            var $scroller = self.$el.find('.scroller');

            $scroller.height(
                $(this).height() - 100
            );
        });
    },


    foo: function () {
        if (this.scroller) {
            this.scroller.destroy();
        }

        var $scroller = this.$el.find('.scroller');

        $scroller.height(
            $(window).height() - 100
        );

        this.scroller = new iScroll($scroller.get(0), {
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