Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#timeline-template',
    className: 'column',

    events: {
        'click .button.promote': 'promoteItem',
        'click .button.demote': 'demoteItem',
        'click .nav .now': 'now'
    },

    itemViewContainer: '.children',

    initialize: function (options) {
        var self = this;

        // Initialize scroller
        this.on('collection:rendered', function(){
            // Trigger resize to adjust items height, use CSS3 calc in future
            $(window).trigger('resize');

            setTimeout(function(){
                self.bindScroller();
                self.now();
            }, jQuery.fx.speeds.slow + 250);
        });


        // On item add, refresh scroller
        this.on('after:item:added', function(){
            self.scrollerTimeout = null;

            clearTimeout(self.scrollerTimeout);

            self.scrollerTimeout = setTimeout(function(){
                self.refreshScroller();
            }, jQuery.fx.speeds.slow + 250);
        });


        // On item remove refresh scroller
        this.on('item:removed', function(){
            self.scrollerTimeout = null;

            clearTimeout(self.scrollerTimeout);

            self.scrollerTimeout = setTimeout(function(){
                self.refreshScroller();
            }, jQuery.fx.speeds.slow + 250);
        });


        // Adjust scroller height
        $(window).resize(function(){
            var $scroller = self.$el.find('.scroller');

            // - 100 is height space
            $scroller.height(
                $(this).height() - 100
            );
        });
    },


    bindScroller: function () {
        var self = this;

        if (this.iscroll) {
            this.iscroll.destroy();
        }

        var $scroller = this.$el.find('.scroller');

        this.iscroll = new iScroll($scroller.get(0), {
            momentum: true,
            hScrollbar: false,
            vScroll: true,
            onScrollEnd: function() {
                _.bind(self.infiniteScroll, self, this)();
                _.bind(self.updateNeedle, self, this)();
                // _.bind(self.updateNeedlePosition, self, this)();
            }
        });

        return this;
    },


    refreshScroller: function() {
        if (this.iscroll === undefined) {
            return;
        }

        this.iscroll.refresh();
    },


    resetScroller: function() {
        var defer = $.Deferred();

        var self = this;

        if (self.iscroll.y !== 0) {
            self.iscroll.scrollTo(0, 0, jQuery.fx.speeds.slow);

            setTimeout(function(){
                defer.resolve();
            }, jQuery.fx.speeds.slow + 250);
        } else {
            defer.resolve();
        }

        return defer.promise();
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


    updateNeedle: function() {
        var $needle = this.$el.find('.needle');


        var offset = $needle.offset();

        // Get element below needle
        var $item = $(document.elementFromPoint(
            offset.left,
            offset.top + 4
        )).closest('.item');

        if ($item.length === 0) {
            return;
        }

        var model = $item.data('model');

        var time = model.time();

        if (Math.abs(time.diff()) < moment().add('day', 1).diff()) {
            $needle.find('.date').text(
                'Today at ' +time.format(' hh:mm:ss A')
            );
        } else if (Math.abs(time.diff()) < moment().add('months', 1).diff()) {
            $needle.find('.date').text(
                time.format('Do MMMM hh:mm A')
            );
        } else {
            $needle.find('.date').text(
                time.format('Do MMMM YYYY')
            );
        }
    },


    updateNeedlePosition: function() {
        var $needle = this.$el.find('.needle');

        var difference = Math.abs(this.iscroll.maxScrollY) - Math.abs(this.iscroll.y);

        if (difference < 200) {
            $needle.css('top', 'calc(50% + ' + difference + 'px)');
        }
    },


    addItem: function(item) {
        this.collection.add(item);
    },


    promoteItem: function (event) {
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


    demoteItem: function (event) {
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


    now: function() {
        var self = this;


        var promise = this.collection.now();

        promise.done(function(model) {
            var $closest = self.$el.find('.item[data-id='+model.get('id')+']'),
                $needle  = self.$el.find('.needle');


            var position = $closest.position(),
                offset   = $needle.position();

            self.iscroll.scrollTo(
                -(position.left),
                -(position.top - offset.top + 40),
                0
            );

            $closest.addClass('now');
            $needle.find('.date').text('Now');
        });
    },



    showNoResults: function() {
        var itemViewContainer = this.getItemViewContainer(this);

        if (itemViewContainer.find('.no-results').length > 0) {
            return;
        }

        var noResults = new Application.View.NoResults();
            noResults.render();

        itemViewContainer.append(noResults.el);
    },


    showLoadMore: function() {
        var itemViewContainer = this.getItemViewContainer(this);

        if (itemViewContainer.find('.load-more').length > 0) {
            return;
        }

        var loadMore = new Application.View.LoadMore();
            loadMore.render();

        this.listenTo(loadMore, 'loadmore', this.loadMore);

        itemViewContainer.append(loadMore.el);
    },

    hideLoadMore: function() {

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
            console.log(self.collection.last().attributes);
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
        item.set('order', this.model.get('order'));

        return new Application.View.Item({
            model: item
        });
    }
});