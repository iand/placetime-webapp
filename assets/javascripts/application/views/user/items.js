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
        var self = this;

        clearTimeout(this.timeout);

        this.timeout = setTimeout(function(){
            self.iscroll.refresh();
        }, jQuery.fx.speeds.slow + 250);
    },


    infiniteScroll: function(event) {
        var self = this;


        clearTimeout(self.infiniteScrollReference);

        self.infiniteScrollLoading = false;
        self.infiniteScrollReference = setTimeout(function(){
            if (self.infiniteScrollLoading === true) {
                return;
            }

            if (Math.abs(event.y) < Math.abs(event.maxScrollY + 100)) {
                return;
            }

            var data = {
                pid: self.model.get('pid'),
                status: self.model.get('status'),
                order: 'ets',
                count: 2500
            };

            // TODO: Conditionally set tend/tstart
            if (self.model.get('order') === 'ets') {
                data.tend = moment(
                    self.collection.last().get('ets')
                ).unix() - 1;
            } else {
                data.tend = moment(
                    self.collection.last().get('ts')
                ).unix() - 1;
            }


            self.infiniteScrollLoading = true;

            self.collection.fetch({
                data: data
            }).done(function(){
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
        var sorted = _.sortBy(this.collection.models, function(model){
            return Math.abs(moment().diff(model.get('ets')));
        });

        // TODO: Don't set id on child but parent
        var closest = this.$el.find('.item > div[data-id='+sorted[0].get('id')+']').parent();
            closest.css('background-color', '#ff6600');

        // Scroll to the closest element
        this.iscroll.scrollToElement(
            closest.get(0)
        );
    },


    event: function() {
        this.model.set('order', 'ets');

        this.collection.order = 'ets';
        this.collection.fetch({
            data: {
                pid: this.model.get('pid'),
                status: this.model.get('status'),
                order: this.model.get('order')
            }
        });
    },


    added: function() {
        this.model.set('order', 'ts');

        this.collection.order = 'ts';
        this.collection.fetch({
            data: {
                pid: this.model.get('pid'),
                status: this.model.get('status'),
                order: this.model.get('order')
            }
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