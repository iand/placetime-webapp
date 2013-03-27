Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#timeline-template',
    className: 'column',

    events: {
        'click .button.promote': 'promoteItem',
        'click .button.demote': 'demoteItem',
        'click .nav .now': 'now',
        'click .nav .ets': 'event',
        'click .nav .ts': 'added'
    },

    itemViewContainer: '.children',

    initialize: function (options) {
        var self = this;

        // Scroller events
        this.on('collection:rendered', function(){
            setTimeout(function(){
                self.bindScroller();
            }, jQuery.fx.speeds.slow + 250);
        });
        this.on('after:item:added', function(){
            self.scrollerTimeout = null;

            clearTimeout(self.scrollerTimeout);

            self.scrollerTimeout = setTimeout(function(){
                self.refreshScroller();
            }, jQuery.fx.speeds.slow + 250);
        });
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

        $scroller.height(
            $(window).height() - 100
        );

        this.iscroll = new iScroll($scroller.get(0), {
            momentum: true,
            hScrollbar: false,
            vScroll: true,
            onScrollEnd: function() {
                _.bind(self.infiniteScroll, self, this)();
            }
        });

        return this;
    },


    refreshScroller: function() {
        this.iscroll.refresh();
    },


    resetScroller: function() {
        var defer = $.Deferred();

        var self = this;

        if (self.iscroll.y !== 0) {
            self.iscroll.scrollTo(0, 0, jQuery.fx.speeds.slow);

            setTimeout(function(){
                defer.resolve();
            }, jQuery.fx.speeds.slow + 200);
        } else {
            defer.resolve();
        }

        return defer.promise();
    },


    infiniteScroll: function(event) {
        var self = this;


        clearTimeout(self.infiniteScrollReference);

        self.infiniteScrollReference = setTimeout(function(){
            // Don't execute if not the bottom
            if (Math.abs(event.y) < Math.abs(event.maxScrollY + (140 * 2))) {
                return;
            }

            // Don't try again if already loading
            if (self.infiniteScrollLoading && self.infiniteScrollLoading === true) {
                return;
            }

            // Don't try again if it was within five seconds
            if (self.infiniteScrollLast && self.infiniteScrollLast.diff() > -5000) {
                return;
            }

            var data = {
                pid: self.model.get('pid'),
                status: self.model.get('status'),
                order: self.model.get('order'),
                count: 5
            };

            if (self.model.get('order') === 'ets') {
                data.tstart = moment(
                    self.collection.first().get('ets')
                ).unix() - 1;
            } else {
                data.tend = moment(
                    self.collection.last().get('ts')
                ).unix() - 1;
            }

            self.infiniteScrollLoading = true;

            self.collection.fetch({
                remove: false,
                data: data
            }).done(function(data){
                data.forEach(function(item){
                    console.log(item.text);
                });

                self.infiniteScrollLast    = moment();
                self.infiniteScrollLoading = false;
            });
        }, 150);
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
        var now = this.collection.now();

        var closest = this.$el.find('.item[data-id='+now.get('id')+']');
            closest.addClass('now');

        // Scroll to the closest element
        this.iscroll.scrollToElement(
            closest.get(0)
        );
    },



    event: function() {
        var self = this;

        self.resetScroller().done(function(){
            self.model.set('order', 'ets');

            self.collection.order = 'ets';
            self.collection.fetch({
                reset: true,
                data: {
                    tstart: undefined,
                    tend: undefined,
                    pid: self.model.get('pid'),
                    status: self.model.get('status'),
                    order: self.model.get('order')
                }
            });
        });
    },


    added: function() {
        var self = this;

        self.resetScroller().done(function(){
            self.model.set('order', 'ts');

            self.collection.order = 'ts';
            self.collection.fetch({
                reset: true,
                data: {
                    tstart: undefined,
                    tend: undefined,
                    pid: self.model.get('pid'),
                    status: self.model.get('status'),
                    order: self.model.get('order')
                }
            });
        });
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
        item.set('status', this.model.get('status'));
        item.set('order', this.model.get('order'));

        return new Application.View.Item({
            model: item
        });
    }
});