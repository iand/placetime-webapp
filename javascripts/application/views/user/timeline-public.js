Application.View.TimelinePublic = Application.View.Timeline.extend({
    name: 'timeline-public',

    className: 'column public',
    events: {
        'click .header .now': 'refresh',
        'submit .header .form': 'search'
    },


    initialize: function(options) {
        this.initialEvents();

        // Handle
        this.on('view:followings', function(pid){
            this.followings(pid);
        });

        this.on('view:followers', function(pid){
            this.followers(pid);
        });
    },



    timeline: function(pid) {
        var status;
        if (pid === undefined) {
            pid    = this.model.get('pid');
            status = 'p';
        } else {
            status = 'm';
        }

        var collection = new Application.Collection.Items(undefined, {
            status: status,
            pid: pid
        });

        var model = new Backbone.Model({
            pid: pid,
            status: status
        });

        var view = new Application.View.Items({
            collection: collection,
            model: model
        });

        this.bindEvents(view);


        // Bubble
        this.listenTo(view, 'item:promoted', function(event) {
            this.trigger('item:promoted', event);
        });

        this.region.show(view);
    },



    followings: function(pid) {
        if (pid === undefined) {
            pid = this.model.get('pid');
        }

        var collection = new Application.Collection.Followings();

        var model = new Backbone.Model({
            pid: pid,
            count: 20,
            start: 10
        });

        var view = new Application.View.Followings({
            collection: collection,
            model: model
        });

        this.bindEvents(view);

        this.region.show(view);
    },



    followers: function(pid) {
        if (pid === undefined) {
            pid = this.model.get('pid');
        }

        var collection = new Application.Collection.Followers();

        var model = new Backbone.Model({
            pid: pid,
            count: 20,
            start: 10
        });

        var view = new Application.View.Followers({
            collection: collection,
            model: model
        });

        this.bindEvents(view);

        this.region.show(view);
    },




    search: function() {
        var $form = $(event.target);

        this.region.listenToOnce('search:done', function(data){
            // Render search result view
        });
        this.region.listenToOnce('search:fail', function(data){
            // Render error
        });

        this.region.currentView.trigger('search', $form.find('input').val());

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
    }
});