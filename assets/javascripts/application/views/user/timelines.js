Application.View.Timelines = Marionette.ItemView.extend({
    template: '#timelines-template',
    className: 'container-wide timelines',

    initialize: function(options) {
        this.initViews();
        this.initEvents();
    },


    initViews: function() {
        this.subviews = new Backbone.ChildViewContainer();


        this.subviews.add(new Application.View.Timeline({
            model: new Backbone.Model({
                pid: this.options.pid,
                view: 'timeline',
                status: 'p'
            })
        }), 'publicTimeline');


        this.subviews.add(new Application.View.Timeline({
            model: new Backbone.Model({
                pid: this.options.pid,
                view: 'timeline',
                status: 'm'
            })
        }), 'privateTimeline');
    },



    initEvents: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        this.listenTo(publicTimeline, 'item:promoted', function(event) {
            privateTimeline.trigger('item:add', event);
        });

        this.listenTo(privateTimeline, 'item:demoted', function(event){
            publicTimeline.trigger('item:add', event);
        });
    },


    onRender: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        publicTimeline.render();
        privateTimeline.render();

        this.$el.find('.timeline-public').replaceWith(publicTimeline.el);
        this.$el.find('.timeline-private').replaceWith(privateTimeline.el);
    }
});