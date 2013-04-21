Application.View.TimelinePublic = Application.View.Timeline.extend({
    events: {
        'click .header .now': 'now',
        'submit .header .form': 'search'
    },


    initialize: function(options) {
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
        this.constructor.__super__.initEvents.call(this, arguments);

        // Bubble promoted/demoted timeline events
        var timeline = this.subviews.findByCustom('timeline'),
            followings = this.subviews.findByCustom('followings'),
            followers = this.subviews.findByCustom('followers');

        // Bubble
        this.listenTo(timeline, 'item:promoted', function(event) {
            this.trigger('item:promoted', event);
        });


        // Handle
        this.on('view:followings', function(){
            this.region.show(followings);
        });

        this.on('view:followers', function(){
            this.region.show(followers);
        });

        this.on('view:timeline', function(){
            this.region.show(timeline);
        });
    },




    now: function() {
        this.region.currentView.trigger('now', this);
    },



    search: function() {
        return false;
    },



    onRender: function() {
        this.constructor.__super__.onRender.call(this, arguments);

        var self = this;

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


        // Initial view
        var view = this.subviews.findByCustom(
            this.model.get('view')
        );

        this.region.show(view);
    }
});