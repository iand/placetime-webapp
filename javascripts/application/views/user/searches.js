Application.View.Searches = Backbone.Marionette.CompositeView.extend({
    template: '#searches-template',
    className: 'searches',

    itemViewContainer: '.children',

    itemView: Application.View.Item,
    emptyView: Application.View.ItemEmpty,

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


    initialize: function (options) {
        this.subviews = new Backbone.ChildViewContainer();
        this.subviews.add(new Application.View.Needle(), 'needle');

        this.on('composite:rendered', function(){
            this.$el.find('.scroller').scroll(_.bind(this.onScroll, this));
        });

        // Custom events
        this.on('item:add', function(event) {
            this.collection.add(event);
        });


        // Handle infinite scroll
        this.on('infinite:load', this.load);
        this.on('infinite:load', this.loading);
        this.on('infinite:loaded', this.loaded);
        this.on('infinite:failed', this.loaded);

        // Handle needle displaying
        this.on('after:item:added', this.renderNeedle);
        this.on('item:removed', this.renderNeedle);
    },



    renderNeedle: function() {
        if (this.collection.length > 0) {
            this.$el.find('.needle-view').html(
                this.subviews.findByCustom('needle').render().el
            );
        } else {
            this.$el.find('.needle-view').empty();
        }
    },



    load: function(options) {
        var self = this;

        var data = {
            pid: self.model.get('pid'),
            status: self.model.get('status')
        };

        if (options.before) {
            data.after = 0;
            data.before = 40;
            data.ts = self.collection.last().get('ts');
        } else if (options.after) {
            data.after = 40;
            data.before = 0;
            data.ts = self.collection.first().get('ts');
        } else {
            throw new Error('Invalid options provided');
        }

        self.collection.fetch({
            remove: false,
            data: data
        }).done(function(){
            self.trigger('infinite:loaded');
        }).fail(function(){
            self.trigger('infinite:failed');
        });
    },


    loading: function(options) {
        this.loading = new Application.View.Loading(options);
        this.loading.render();

        this.$el.append(this.loading.$el);
    },


    loaded: function(options) {
        this.loading.remove();
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