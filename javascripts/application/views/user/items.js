Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#items-template',
    className: 'items',

    events: {
        'click .promote': 'promote',
        'click .demote': 'demote'
    },

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

        // Custom events
        this.on('item:add', function(event) {
            console.log(event);
            this.collection.add(event);
        });


        // Pass scroll event to needle subview
        this.on('scroll', function(event) {
            this.subviews.findByCustom('needle').trigger('scroll', event);
        });

        // Handle infinite scroll
        this.on('infinite:load', this.loadMore);

        // Handle needle displaying
        this.on('after:item:added', this.renderNeedle);
        this.on('item:removed', this.renderNeedle);

        // Handle now
        this.on('now', this.now);
    },


    onShow: function() {
        var promise = this.collection.fetch({
            data: {
                pid: this.model.get('pid'),
                before: 20,
                after: 20
            }
        });

        promise.done(this.renderNeedle.bind(this));
    },


    onRender: function() {
        this.renderNeedle();
    },


    renderNeedle: function() {
        if (this.collection.length > 0) {
            var needle = this.subviews.findByCustom('needle');

            if (needle.isRendered === false) {
                needle.render();

                this.$el.find('.needle-view').html(needle.el);
            } else {
                return;
            }

        } else {
            this.$el.find('.needle-view').empty();
        }
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
            var $closest = self.$el.find('.item[data-id='+model.idSafe()+']'),
                $needle  = self.$el.find('.needle');

            var position = $closest.position(),
                offset   = $needle.position();

            // Unbind scroll event whilst we scroll to now
            self.off('scroll');

            self.trigger('scroll:to', {
                left: -(position.left),
                top: -(position.top - offset.top),
                duration: jQuery.fx.speeds.slow
            });

            // Once scroll to finished, rebind it, ideally
            // this shouldn't be necessary but iScroll sucks
            setTimeout(function(){
                self.on('scroll', function(event) {
                    self.subviews.findByCustom('needle').trigger('scroll', event);
                });
            }, jQuery.fx.speeds.slow + 250);

            $closest.addClass('now');
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

        self.collection.fetch({
            remove: false,
            data: data
        }).done(function(){
            self.trigger('infinite:loaded');
        }).fail(function(){
            self.trigger('infinite:failed');
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
        var view = Backbone.Marionette.CompositeView.prototype.buildItemView.apply(this, arguments);

        view.model.set('status', this.model.get('status'), {
            silent: true
        });

        return view;
    }
});