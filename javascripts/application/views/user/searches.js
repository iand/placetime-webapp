Application.View.Searches = Backbone.Marionette.CompositeView.extend({
    template: '#searches-template',
    className: 'searches',

    events: {
        'click .promote': 'promote'
    },

    itemViewContainer: '.children',

    itemView: Application.View.Search,
    emptyView: Application.View.SearchEmpty,

    // Bubble collection events
    collectionEvents: {
        'item:promoted': 'itemPromoted'
    },

    itemPromoted: function(item) {
        this.trigger('item:promoted', item);
    },


    initialize: function (options) {
        this.on('composite:rendered', function(){
            this.$el.find('.scroller').scroll(_.bind(this.onScroll, this));
        });

        // Handle
        this.on('reload', this.reload);
        this.on('now', this.now);
    },


    onScroll: function(event) {
        // Bubble
        this.trigger('scroll', event);
    },


    onShow: function() {
        var self = this;

        var promise = this.collection.search({
            data: {
                t: 'p',
                s: this.model.get('query')
            }
        });

        // TODO: Ideally move to template and use model state
        promise.done(function(data){
            if (data.length === 0) {
                self.$el.find('span').text('No results');
                self.$el.find('img').remove();
            }
        });

        promise.fail(function(){
            self.$el.find('span').text('Error searching for results');
            self.$el.find('img').remove();
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



    appendHtml: function(collectionView, itemView, index) {
        var itemViewContainer = this.getItemViewContainer(collectionView);

        if (itemViewContainer.children().size() <= index) {
            itemViewContainer.append(itemView.el);
        } else {
            itemViewContainer.children().eq(index).before(itemView.el);
        }
    }
});