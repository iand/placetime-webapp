Application.View.Timelines = Marionette.ItemView.extend({
    template: '#timelines-template',
    className: 'container-wide timelines',

    initialize: function(options) {
        // Initialize courier
        Backbone.Courier.add(this);

        // Initialize subviews
        Backbone.Subviews.add(this);
    },


    subviewCreators : {
        publicTimeline: function() {
            var timeline = new Application.View.Timeline({
                model: new Backbone.Model({
                    pid: this.options.pid,
                    view: 'timeline',
                    status: 'p'
                })
            });

            return timeline;
        },

        privateTimeline: function() {
            var timeline = new Application.View.Timeline({
                model: new Backbone.Model({
                    pid: this.options.pid,
                    view: 'timeline',
                    status: 'm'
                })
            });

            return timeline;
        }
    },


    onMessages: {
        'item:promoted' : function(event) {
            this.subviews.privateTimeline.trigger('item:added', event);
        },

        'item:demoted': function(event) {
            this.subviews.publicTimeline.trigger('item:added', event);
        }
    }
});