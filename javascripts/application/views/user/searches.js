Application.View.Searches = Backbone.Marionette.CompositeView.extend({
    template: '#searches-template',

    events: {
        'click .promote': 'promote'
    },

    modelEvents: {
        'change:loading': 'render'
    },

    itemViewContainer: '.collection-children',

    itemView: Application.View.SearchItem,
    emptyView: Application.View.SearchEmpty,

    className: function() {
        var className = 'collection collection-searches';

        if (this.model.get('t') === 'p') {
            className += ' profiles';
        } else {
            className += ' items';
        }

        return className;
    },

    // Bubble collection events
    collectionEvents: {
        'item:added': 'itemAdded'
    },

    itemAdded: function(item) {
        this.trigger('item:added', item);
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
        if (this.model.get('t') === 'p') {
            this.itemView = Application.View.SearchProfile;
        } else {
            this.itemView = Application.View.SearchItem;
        }

        var self    = this;
        var promise = this.collection.search({
            data: {
                t: this.model.get('t'),
                s: this.model.get('s')
            }
        });

        promise.always(function(){
            self.model.set('loading', false);
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


    showEmptyView: function(){
        var EmptyView = Marionette.getOption(this, 'emptyView');

        if (EmptyView && !this._showingEmptyView){
            this._showingEmptyView = true;
            this.addItemView(this.model, EmptyView, 0);
        }
    },


    appendHtml: function(collectionView, itemView, index) {
        var itemViewContainer = this.getItemViewContainer(collectionView);

        if (itemViewContainer.children().size() <= index) {
            itemViewContainer.append(itemView.el);
        } else {
            itemViewContainer.children().eq(index).before(itemView.el);
        }
    },


    buildItemView: function(item, ItemViewType, itemViewOptions) {
        var view = Backbone.Marionette.CompositeView.prototype.buildItemView.apply(this, arguments);

        view.model.set({
            user: this.model.get('pid')
        }, {
            silent: true
        });

        return view;
    }
});