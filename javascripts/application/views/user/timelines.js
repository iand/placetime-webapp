Application.View.Timelines = Backbone.Marionette.ItemView.extend({
    name: 'layout-timelines',
    template: '#timelines-template',
    className: 'layout-container-wide timelines',

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
                options: this.options.public.options || {},
                status: 'p'
            })
        });

        this.subviews.add(publicTimeline, 'publicTimeline');


        var privateTimeline = new Application.View.TimelinePrivate({
            model: new Backbone.Model({
                pid: this.options.private.pid,
                view: this.options.private.view,
                options: this.options.private.options || {},
                status: 'm'
            })
        });

        this.subviews.add(privateTimeline, 'privateTimeline');
    },



    initEvents: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        this.listenTo(publicTimeline, 'item:promoted', function(items) {
            _.each(items, function(item) {
                privateTimeline.trigger('item:add', item);
            });
        });

        this.listenTo(privateTimeline, 'item:created', function(event) {
            privateTimeline.trigger('item:add', event);
        });

        // Public timeline
        this.on('public:followings', function(options) {
            publicTimeline.trigger('view:followings', options);
        });

        this.on('public:followers', function(options) {
            publicTimeline.trigger('view:followers', options);
        });

        this.on('public:timeline', function(options) {
            publicTimeline.trigger('view:timeline', options);
        });

        this.on('public:search', function(options) {
            publicTimeline.trigger('view:search', options);
        });

        // Private timeline
        this.on('private:itemAdd', function(options) {
            privateTimeline.trigger('view:itemAdd', options);
        });

        this.on('private:timeline', function(options) {
            privateTimeline.trigger('view:timeline', options);
        });
    },


    onRender: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        this.$el.find('.timeline-public').replaceWith(publicTimeline.render().el);
        this.$el.find('.timeline-private').replaceWith(privateTimeline.render().el);
    }
});