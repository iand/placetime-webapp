Application.View.Searches = Backbone.Marionette.CompositeView.extend({
    template: '#searches-template',

    events: {
        'click .promote': 'promote'
    },

    itemViewContainer: '.children',

    itemView: Application.View.SearchItem,
    emptyView: Application.View.SearchEmpty,

    className: function() {
        var className = 'searches';

        if (this.model.get('t') === 'i') {
            className += ' items';
        } else {
            className += ' profiles';
        }

        return className;
    },

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

        if (this.model.get('t') === 'i') {
            this.itemView = Application.View.SearchItem;
        } else {
            this.itemView = Application.View.SearchProfile;
        }

        var promise = this.collection.search({
            data: {
                t: this.model.get('t'),
                s: this.model.get('s')
            }
        });

        // TODO: Ideally move to template and use model state
        promise.done(function(data){
            if (data.results.length === 0) {
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