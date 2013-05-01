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
        this.on('view:followings', function(){
            this.followings();
        });

        this.on('view:followers', function(){
            this.followers();
        });
    },



    timeline: function() {
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

        this.bindEvents(view);


        // Bubble
        this.listenTo(view, 'item:promoted', function(event) {
            this.trigger('item:promoted', event);
        });

        this.region.show(view);
    },



    followings: function() {
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

        this.bindEvents(view);

        this.region.show(view);
    },



    followers: function() {
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

        this.bindEvents(view);

        this.region.show(view);
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


        this.timeline();
    }
});