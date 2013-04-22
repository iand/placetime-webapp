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

        this.listenTo(publicTimeline, 'item:promoted', function(event) {
            privateTimeline.trigger('item:add', event);
        });

        this.listenTo(privateTimeline, 'item:created', function(event) {
            privateTimeline.trigger('item:add', event);
        });

        // Public timeline
        this.on('public:followings', function(){
            publicTimeline.trigger('view:followings');
        });

        this.on('public:followers', function(){
            publicTimeline.trigger('view:followers');
        });

        this.on('public:timeline', function(){
            publicTimeline.trigger('view:timeline');
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