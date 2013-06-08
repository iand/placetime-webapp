Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#items-template',
    className: 'items',

    events: {
        // Because of how frequent the needle is re-rendered
        // it's more efficient to use event delegation
        'click .needle .icon-repeat': 'now',
        'click .item': 'focus'
    },

    modelEvents: {
        'change:loading': 'render'
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
        this.subviews.add(new Application.View.Now(), 'separator');

        this.on('composite:rendered', function(){
            this.$el.find('.scroller').scroll(_.bind(this.onScroll, this));
        });

        // Custom events
        this.on('item:add', this.now);
        this.on('item:add', function(event) {
            this.collection.add(event);


            var item = this.collection.findWhere({
                id: event.id
            });

            var itemPosition = this.$el.find('.item[data-id='+item.idSafe()+']').position();

            // If it's the first item, no need to include padding
            if (itemPosition.top === 46) {
                itemPosition.top = 0;
            }

            this.trigger('scrollTo', {
                left: itemPosition.left,
                top: itemPosition.top,
                duration: jQuery.fx.speeds.slow
            });
        });


        // Handle infinite scroll
        this.on('infinite:load', this.load);
        this.on('infinite:load', this.loading);
        this.on('infinite:done', this.loaded);
        this.on('infinite:failed', this.loaded);

        // Handle needle displaying
        this.on('after:item:added', this.renderNeedle);
        this.on('item:removed', this.renderNeedle);

        // Handle
        this.on('reload', this.reload);
        this.on('now', this.now);
        this.on('now:done', this.renderSeparator);
    },


    onScroll: function(event) {
        // Bubble
        this.trigger('scroll', event);

        // Capture
        this.subviews.findByCustom('needle').trigger('scroll', event);
    },


    onShow: function() {
        var self    = this;
        var promise = this.collection.fetch({
            data: {
                pid: this.model.get('pid'),
                status: this.model.get('status'),
                before: 25,
                after: 25
            }
        });

        promise.always(function(){
            self.model.set('loading', false);
        });
    },



    renderNeedle: function() {
        var $view = this.$el.find('.needle-view');

        if (this.collection.length > 0) {
            if ($view.is(':empty') === true) {
                this.$el.find('.needle-view').html(
                    this.subviews.findByCustom('needle').render().el
                );
            } else {
                this.subviews.findByCustom('needle').trigger('update');
            }
        } else {
            $view.empty();
        }
    },


    reload: function() {
        var self = this;

        var promise = this.collection.fetch({
            data: {
                pid: this.model.get('pid'),
                before: 25,
                after: 25,
                ts: undefined
            },
            reset: true
        });

        promise.done(function(data){
            self.trigger('reload:done');
        });

        promise.fail(function(){
            self.trigger('reload:error');
        });
    },


    focus: function(event) {
        var $target = $(event.target);

        $target.toggleClass('focused');
        $target.siblings().removeClass('focused');
    },


    now: function(duration) {
        var self = this;


        var promise = this.collection.now();

        promise.done(function(model) {
            var $closest = self.$el.find('.item[data-id='+model.idSafe()+']'),
                $needle = self.$el.find('.needle');

            if ($closest.length === 0) {
                return;
            }

            var itemPosition = $closest.position(),
                needlePosition = $needle.position(),
                separatorHeight = 28;

            // If it's the first item, no need to include padding
            if (itemPosition.top === 46) {
                itemPosition.top = 0;
            }

            // Scroll to
            self.trigger('scrollTo', {
                left: itemPosition.left,
                top: itemPosition.top - (needlePosition.top) + separatorHeight,
                duration: jQuery.fx.speeds.slow
            });

            $closest.siblings().removeClass('now');
            $closest.addClass('now');
        });


        promise.done(function(data){
            self.trigger('now:done');
        });

        promise.fail(function(){
            self.trigger('now:error');
        });


        return promise;
    },


    renderSeparator: function() {
        var $now = this.$el.find('.item.now');

        if ($now.prev().is('.now-separator') === true) {
            return;
        }

        this.$el.find('.now-separator').remove();

        $now.before(
            this.subviews.findByCustom('separator').render().el
        );
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
        }).done(function(data){
            self.trigger('infinite:done', data);
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
           status: this.model.get('status'),
           user: this.model.get('pid')
        }, {
            silent: true
        });

        return view;
    }
});