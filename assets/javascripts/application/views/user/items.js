Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#items-template',
    className: 'items',

    events: {
        'click .promote': 'promote',
        'click .demote': 'demote'
    },

    itemView: Application.View.Item,
    itemViewContainer: '.children',

    initialize: function (options) {
        var self = this;


        // Initialize subviews
        Backbone.Subviews.add(self);

        // Initialize courier
        Backbone.Courier.add(self);

        // Bubble view events, look into passMessage
        this.on('collection:rendered', function(){
            self.spawn('collection:rendered');
        });

        this.on('composite:collection:rendered', function(){
            self.spawn('collection:rendered');
        });

        this.on('after:item:added', function(){
            self.spawn('item:added');
        });

        this.on('item:removed', function(){
            self.spawn('item:removed');
        });


        // Bubble collection events
        this.listenTo(this.collection, 'item:promoted', function(event) {
            self.spawn('item:promoted', event);
        });

        this.listenTo(this.collection, 'item:demoted', function(event) {
            self.spawn('item:demoted', event);
        });




        // Custom events
        this.on('item:added', function(event) {
            self.collection.add(event.data);
        });

        this.on('scroll', function(event) {
            this.subviews.needle.scroll(event);
        });

        this.on('now', this.now);
        this.on('scroll', this.infiniteScroll);
    },



    subviewCreators : {
        needle: function() {
            return new Application.View.Needle();
        }
    },



    infiniteScroll: function(event) {
        var self = this;


        clearTimeout(self.infiniteScrollReference);

        // self.infiniteScrollLast = moment();
        self.infiniteScrollReference = setTimeout(function(){
            // Loading
            if (self.infiniteScrollLoading === true) {
                return;
            }

            // Buffer
            // else if (self.infiniteScrollLast.diff() > -2000) {
            //     return;
            // }

            // Top infinite scroll
            else if (Math.abs(event.y) < (140 * 5)) {
                loadingMore = self.loadMore({ after: true });
            }

            // Bottom infinite scroll
            else if (Math.abs(event.y) > Math.abs(event.maxScrollY + (140 * 5))) {
                loadingMore = self.loadMore({ before: true });
            }

            // Somehwere inbetween
            else {
                return;
            }


            self.infiniteScrollLoading = true;

            loadingMore.done(function(data){
                if (data.length === 0) {
                    self.refreshScroller();
                }

                // self.infiniteScrollLast    = moment();
                self.infiniteScrollLoading = false;
            });
        }, 150);
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


    now: function() {
        var self = this;

        var promise = this.collection.now();

        promise.done(function(model) {
            var $closest = self.$el.find('.item[data-id='+model.get('id')+']'),
                $needle  = self.$el.find('.needle');


            var position = $closest.position(),
                offset   = $needle.position();


            self.trigger('scroll:to', {
                left: -(position.left),
                top: -(position.top - offset.top),
                duration: 0
            });

            $closest.addClass('now');

            // TODO: Use template
            $needle.find('.date').html(
                '<span class="future pull-left">' +
                  '<i class="icon-arrow-up"></i> Future' +
                '</span>' +
                '<span class="now">Now</span>' +
                '<span class="past pull-right">' +
                  'Past <i class="icon-arrow-down"></i>' +
                '</span>'
            );
        });
    },





    loadMore: function(options){
        var self = this;

        var data = {
            pid: self.model.get('pid'),
            status: self.model.get('status')
        };

        if (options.before) {
            data.after = 0;
            data.before = 10;
            data.ts = self.collection.last().get('ts');
        } else if (options.after) {
            data.after = 10;
            data.before = 0;
            data.ts = self.collection.first().get('ts');
        } else {
            throw new Error('Invalid options provided');
        }

        return self.collection.fetch({
            remove: false,
            data: data
        });
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
        item.set('status', this.model.get('status'));

        return new Application.View.Item({
            model: item
        });
    }
});