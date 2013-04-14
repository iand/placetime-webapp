Application.View.Timeline = Backbone.Marionette.ItemView.extend({
    template: '#timeline-template',

    className: 'column',

    events: {
        'click .header .timeline': 'timeline',
        'click .header .followings': 'followings',
        'click .header .followers': 'followers',
        'click .header .now': 'now'
    },


    initialize: function (options) {
        // Initialize subviews
        this.initSubviews();
        this.initEvents();
    },


    initSubviews: function() {
        // Setup subviews
        this.subviews = new Backbone.ChildViewContainer();

        this.initTimeline();
        this.initFollowings();
        this.initFollowers();
    },


    initTimeline: function() {
        var collection = new Application.Collection.Items(undefined, {
            status: this.model.get('status')
        });

        var model = new Backbone.Model({
            pid: this.model.get('pid'),
            status: this.model.get('status')
        });

        var view = new Application.View.Items({
            collection: collection,
            model: model
        });

        this.subviews.add(view, 'timeline');
    },


    initFollowings: function() {
        var collection = new Application.Collection.Followings();

        var model = new Backbone.Model({
            pid: this.model.get('pid'),
            count: 20,
            start: 10
        });

        var view = new Application.View.Followings({
            collection: collection,
            model: model
        });

        this.subviews.add(view, 'followings');
    },


    initFollowers: function() {
        var collection = new Application.Collection.Followers();

        var model = new Backbone.Model({
            pid: this.model.get('pid'),
            count: 20,
            start: 10
        });

        var view = new Application.View.Followers({
            collection: collection,
            model: model
        });

        this.subviews.add(view, 'followers');
    },



    initEvents: function() {
        $(window).on('resize', this.resizeScroller.bind(this));

        // Pass message to current view
        this.on('item:add', function(event) {
            this.region.currentView.trigger('item:add', event);
        });


        // Bubble promoted/demoted timeline events
        var timeline = this.subviews.findByCustom('timeline');

        this.listenTo(timeline, 'item:promoted', function(event) {
            this.trigger('item:promoted', event);
        });

        this.listenTo(timeline, 'item:demoted', function(event) {
            this.trigger('item:demoted', event);
        });


        // Subview events
        this.subviews.each(function(view){
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
        var self = this;

        // Create region
        this.region = new Backbone.Marionette.Region({
              el: this.$el.find('.collection')
        });

        // Instead of having state in the model and thus rendering
        // the view we will just add a class
        this.region.show = function(view) {
            var $timeline = self.$el.children();

            var viewClass;
            if (view.id !== undefined) {
                viewClass = view.id;
            } else {
                viewClass = view.className.split(' ')[0];
            }

            // Add class to timeline
            $timeline.attr('class', function(index, className){
                return className.replace(/\s*view-[^\s]+\s*/g, '');
            });
            $timeline.addClass('view-' + viewClass);



            // Add class to navigation
            var $navigation = self.$el.find('.nav > li');

            $navigation.removeClass('active');
            $navigation.filter('.' + viewClass).addClass('active');


            return Backbone.Marionette.Region.prototype.show.apply(this, arguments);
        };


        // TODO: Controller
        if (this.model.get('status') === 'p') {
            switch (Backbone.history.fragment) {
                case 'timeline':
                    this.timeline();
                    break;

                case 'followings':
                    this.followings();
                    break;

                case 'followers':
                    this.followers();
                    break;
            }
        } else {
            this.timeline();
        }
    },


    timeline: function() {
        this.region.show(
            this.subviews.findByCustom('timeline')
        );

        Backbone.history.navigate('timeline', false);

        return false;
    },



    followings: function() {
        this.region.show(
            this.subviews.findByCustom('followings')
        );

        Backbone.history.navigate('followings', false);

        return false;
    },



    followers: function() {
        this.region.show(
            this.subviews.findByCustom('followers')
        );

        Backbone.history.navigate('followers', false);

        return false;
    },


    now: function() {
        this.region.currentView.trigger('now', this);
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

            onScrollEnd: function(event) {
                self.infiniteScroll(this);

                // if (self.region.currentView !== undefined) {
                    self.region.currentView.trigger('scroll', this);
                // }
            }
        });

        return this;
    },


    resizeScroller: function(event) {
        var $scroller = this.$el.find('.scroller');

        // - 59 is height space
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