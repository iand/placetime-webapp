Application.View.Timelines = Backbone.Marionette.ItemView.extend({
    name: 'timelines',
    template: '#timelines-template',
    className: 'container-wide timelines',

    initialize: function(options) {
        this.initViews();
        this.initEvents();
    },


    initViews: function() {
        this.subviews = new Backbone.ChildViewContainer();

        var publicTimeline = new Application.View.TimelinePublic({
            model: new Backbone.Model({
                pid: this.options.public.pid,
                view: this.options.public.view,
                status: 'p'
            })
        });

        this.subviews.add(publicTimeline, 'publicTimeline');


        var privateTimeline = new Application.View.TimelinePrivate({
            model: new Backbone.Model({
                pid: this.options.private.pid,
                view: this.options.private.view,
                status: 'm'
            })
        });

        this.subviews.add(privateTimeline, 'privateTimeline');
    },



    initEvents: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        this.listenTo(publicTimeline, 'item:promoted', function(items) {
            // TODO: Remove when move to returning arrays only
            if (_.isArray(items) === false) {
                items = [items];
            }

            _.each(items, function(item) {
                privateTimeline.trigger('item:add', item);
            });
        });

        this.listenTo(privateTimeline, 'item:created', function(event) {
            privateTimeline.trigger('item:add', event);
        });

        // Public timeline
        this.on('public:followings', function(pid) {
            publicTimeline.trigger('view:followings', pid);
        });

        this.on('public:followers', function(pid) {
            publicTimeline.trigger('view:followers', pid);
        });

        this.on('public:timeline', function(pid) {
            publicTimeline.trigger('view:timeline', pid);
        });

        this.on('public:search', function(query) {
            publicTimeline.trigger('view:search', query);
        });


        // Private timeline
        this.on('private:itemAdd', function(){
            privateTimeline.trigger('view:itemAdd');
        });

        this.on('private:timeline', function(){
            privateTimeline.trigger('view:timeline');
        });
    },


    onRender: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        this.$el.find('.timeline-public').replaceWith(publicTimeline.render().el);
        this.$el.find('.timeline-private').replaceWith(privateTimeline.render().el);
    }
});