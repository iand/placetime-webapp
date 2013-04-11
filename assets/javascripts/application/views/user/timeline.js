Application.View.Timeline = Backbone.Marionette.ItemView.extend({
    template: '#timeline-template',

    className: 'column',

    events: {
        'click .header .timeline': 'timeline',
        'click .header .followings': 'followings',
        'click .header .followers': 'followers',
        'click .header .now': 'now',

        'click .header .nav a': 'change'
    },


    initialize: function (options) {
        var self = this;

        // Initialize courier
        Backbone.Courier.add(this);


        // Adjust scroller height
        $(window).resize(function(){
            var $scroller = self.$el.find('.scroller');

            // - 100 is height space
            $scroller.height(
                $(this).height() - 59
            );
        });

        // Pass message
        this.on('item:added', function(event) {
            self.region.currentView.trigger('item:added', event);
        });
    },


    onRender: function() {
        var self = this;

        // Create region
        this.region = new Backbone.Marionette.Region({
              el: this.$el.find('.collection')
        });

        // Render timeline
        this.timeline();
    },


    change: function(event) {
        var $this = $(event.target).closest('li');

        $this.siblings().removeClass('active');
        $this.addClass('active');
    },


    // Load timeline
    timeline: function() {
        var self = this;

        // Load items
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

        this.region.show(view);

        // Fetch after rendering so events are fired
        collection.fetch({
            data: {
                pid: this.model.get('pid'),
                before: 10,
                after: 10
            },
            reset: true
        });
    },



    followings: function() {
        // Load items
        var collection = new Application.Collection.Followings(undefined, {
            pid: this.model.get('pid')
        });

        var view = new Application.View.Followings({
            collection: collection
        });

        this.region.show(view);

        // Fetch after rendering so events are fired
        var promise = collection.fetch({
            data: {
                pid: this.model.get('pid'),
                count: 40
            },
            reset: true
        });
    },



    followers: function() {
        // Load items
        var collection = new Application.Collection.Followers(undefined, {
            pid: this.model.get('pid')
        });

        var view = new Application.View.Followers({
            collection: collection
        });

        this.region.show(view);

        // Fetch after rendering so events are fired
        var promise = collection.fetch({
            data: {
                pid: this.model.get('pid'),
                count: 40
            },
            reset: true
        });
    },


    now: function() {
        this.region.currentView.trigger('now', this);
    },


    onMessages: {
        // TODO: Unify item:removed, item:added methods
        'item:removed': function() {
            var self = this;

            clearTimeout(self.scrollerTimeout);

            self.scrollerTimeout = setTimeout(function(){
                self.refreshScroller();
            }, jQuery.fx.speeds.slow + 250);
        },


        // Update scroller
        'item:added': function() {
            var self = this;

            clearTimeout(self.scrollerTimeout);

            self.scrollerTimeout = setTimeout(function(){
                self.refreshScroller();
            }, jQuery.fx.speeds.slow + 250);
        },


        // Bind scroller
        'collection:rendered': function() {
            $(window).trigger('resize');

            // Wait until animation is finished
            var self = this;
            setTimeout(function(){
                self.bindScroller();
            }, jQuery.fx.speeds.slow + 250);
        }
    },


    passMessages: {
        'item:promoted': '.',
        'item:demoted': '.'
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
            onScrollEnd: function(event) {
                self.region.currentView.trigger('scroll', this);
            }
        });

        this.region.currentView.on('scroll:to', function(event){
            self.iscroll.scrollTo(
                event.left,
                event.top,
                event.duration
            );
        });

        return this;
    },



    refreshScroller: function() {
        if (this.iscroll === undefined) {
            return;
        }

        this.iscroll.refresh();
    }
});