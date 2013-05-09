Application.View.Searches = Backbone.Marionette.CompositeView.extend({
    template: '#searches-template',
    className: 'searches',

    events: {
        'click .promote': 'promote',
        'click .demote': 'demote'
    },

    itemViewContainer: '.children',

    itemView: Application.View.Search,
    emptyView: Application.View.SearchEmpty,

    // Bubble collection events
    collectionEvents: {
        'item:promoted': 'itemPromoted',
        'item:demoted': 'itemDemoted'
    },

    itemDemoted: function(item) {
        this.trigger('item:demoted', item);
    },

    itemPromoted: function(item) {
        this.trigger('item:promoted', item);
    },


    initialize: function (options) {},


    onShow: function() {
        this.collection.search({
            data: {
                s: this.model.get('query')
            }
        });
    },



    promote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');

        var model = this.collection.get(
            $item.data('id')
        );
        model.promote();

        return false;
    },



    demote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');

        var model = this.collection.get(
            $item.data('id')
        );
        model.demote();

        return false;
    },



    appendHtml: function(collectionView, itemView, index) {
        var itemViewContainer = this.getItemViewContainer(collectionView);

        if (itemViewContainer.children().size() <= index) {
            itemViewContainer.append(itemView.el);
        } else {
            itemViewContainer.children().eq(index).before(itemView.el);
        }
    }
});