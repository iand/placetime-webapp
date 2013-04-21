Application.View.Timelines = Backbone.Marionette.ItemView.extend({
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
    },


    onRender: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        this.$el.find('.timeline-public').replaceWith(publicTimeline.render().el);
        this.$el.find('.timeline-private').replaceWith(privateTimeline.render().el);
    }
});