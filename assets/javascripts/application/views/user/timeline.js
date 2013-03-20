Application.View.Timeline = Marionette.ItemView.extend({
    template: '#timelines-template',
    className: 'container timelines',

    initialize: function() {
        Backbone.Subviews.add(this);
    },


    subviewCreators : {
        publicTimeline: function() {
            var timeline = new Application.View.Items({
                model: new Backbone.Model({
                    status: 'p',
                    pid: this.options.pid
                }),
                collection: this.options.publicItems
            });
            timeline.listenTo(this.options.privateItems, 'item:demoted', timeline.addItem);

            return timeline;
        },

        privateTimeline: function() {
            var timeline = new Application.View.Items({
                model: new Backbone.Model({
                    status: 'm',
                    pid: this.options.pid
                }),
                collection: this.options.privateItems
            });
            timeline.listenTo(this.options.publicItems, 'item:promoted', timeline.addItem);

            return timeline;
        }
    }
});