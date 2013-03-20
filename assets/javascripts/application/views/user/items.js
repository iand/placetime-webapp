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

        // Scroller events
        this.on('composite:rendered', this.bindScroller);
        this.on('after:item:added', this.refreshScroller);
        this.on('item:removed', this.refreshScroller);

        // Adjust scroller height
        $(window).resize(function(){
            var $scroller = self.$el.find('.scroller');

            $scroller.height(
                $(this).height() - 100
            );
        });
    },


    bindScroller: function () {
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


    refreshScroller: function() {
        var self = this;

        clearTimeout(this.timeout);

        this.timeout = setTimeout(function(){
            self.scroller.refresh();
        }, jQuery.fx.speeds.slow);
    },


    addItem: function(item) {
        this.collection.add(item);
    },


    promote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');

        var model = this.collection.get(
            $item.data('id')
        );
        model.promote();

        // TODO: Look into event bubbling
        this.collection.trigger('item:promoted', model);
        this.collection.remove(model);

        return false;
    },



    demote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');

        var self = this;

        var model = this.collection.get(
            $item.data('id')
        );
        model.demote();

        // TODO: Look into event bubbling
        this.collection.trigger('item:demoted', model);
        this.collection.remove(model);

        return false;
    },


    appendHtml: function(collectionView, itemView, index) {
        var itemViewContainer;
        if (collectionView.itemViewContainer) {
            itemViewContainer = collectionView.$(collectionView.itemViewContainer);
        } else {
            itemViewContainer = collectionView.$el;
        }

        if (itemViewContainer.children().size() <= index) {
            itemViewContainer.append(itemView.el);
        } else {
            itemViewContainer.children().eq(index).before(itemView.el);
        }
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