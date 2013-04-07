Application.View.Timeline = Marionette.ItemView.extend({
    template: '#timelines-template',
    className: 'container-wide timelines',

    initialize: function(options) {
        Backbone.Subviews.add(this);
    },


    subviewCreators : {
        publicTimeline: function() {
            var timeline = new Application.View.Items({
                model: new Backbone.Model({
                    status: this.options.publicItems.options.status,
                    order: this.options.publicItems.options.order,
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
                    status: this.options.privateItems.options.status,
                    order: this.options.privateItems.options.order,
                    pid: this.options.pid
                }),
                collection: this.options.privateItems
            });
            timeline.listenTo(this.options.publicItems, 'item:promoted', timeline.addItem);

            return timeline;
        }
    }
});