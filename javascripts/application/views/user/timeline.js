Application.View.Timeline = Backbone.Marionette.ItemView.extend({
    name: 'timeline',
    template: '#timeline-template',
    className: 'column',


    initEvents: function() {
        $(window).on('resize', this.resizeScroller.bind(this));

        // Pass message to current view
        this.on('item:add', function(event) {
            this.region.currentView.trigger('item:add', event);
        });


        this.on('view:timeline', function(){
            this.region.show(
                this.subviews.findByCustom('timeline')
            );
        });


        // Subview events
        this.subviews.each(function(view){
            // Allow views not to have a scroller
            if (view.noScroller === true) {
                return;
            }

            // On item added/removed refresh the scroller
            this.listenTo(view, 'after:item:added', this.refreshScroller);
            this.listenTo(view, 'item:removed', this.refreshScroller);


            // On region show bind the scroller and resize
            this.listenTo(view, 'show', this.bindScroller);
            this.listenTo(view, 'show', this.resizeScroller);

            // On first load trigger now
            this.listenToOnce(view, 'show', function(){
                var self = this;

                setTimeout(function(){
                    self.now();
                }, jQuery.fx.speeds.slow + 500);
            });

            this.listenTo(view, 'composite:collection:rendered', this.refreshScroller);

            // Handle infinite scroll loaded
            this.listenTo(view, 'infinite:loaded', function(){
                this.refreshScroller();
                this.infiniteScrollLoading = false;
            });


            // Handle scroll to requests
            this.listenTo(view, 'scroll:to', function(event) {
                this.iscroll.scrollTo(
                    event.left,
                    event.top,
                    event.duration
                );
            });
        }, this);
    },


    onRender: function() {
        // Create region
        this.region = new Backbone.Marionette.Region({
              el: this.$el.find('.collection')
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
            hScroll: false,

            vScroll: true,
            vScrollbar: true,

            scrollbarClass: 'scrollbar',

            onScrollEnd: function(event) {
                self.infiniteScroll(this);

                if (self.region.currentView !== undefined) {
                    self.region.currentView.trigger('scroll', this);
                }
            }
        });

        return this;
    },



    resizeScroller: function(event) {
        var $scroller = this.$el.find('.scroller');

        $scroller.height(
            $(window).height() - 59
        );
    },



    refreshScroller: function() {
        var self = this;

        if (this.iscroll === undefined) {
            return;
        }

        clearTimeout(self.scrollerTimeout);

        self.scrollerTimeout = setTimeout(function(){
            self.iscroll.refresh();
        }, jQuery.fx.speeds.slow + 250);
    },



    infiniteScroll: function(event) {
        var self = this;


        clearTimeout(self.infiniteScrollReference);

        self.infiniteScrollReference = setTimeout(function(){
            // Loading
            if (self.infiniteScrollLoading === true) {
                return;
            }

            // Top infinite scroll
            else if (Math.abs(event.y) < (140 * 5)) {
                self.region.currentView.trigger('infinite:load', {after: true});
            }

            // Bottom infinite scroll
            else if (Math.abs(event.y) > Math.abs(event.maxScrollY + (140 * 5))) {
                self.region.currentView.trigger('infinite:load', {before: true});
            }

            // Somewhere inbetween
            else {
                return;
            }
        }, 150);
    }
});