Application.View.Timeline = Marionette.ItemView.extend({
    template: '#timeline-template',

    initialize: function() {
        Backbone.Subviews.add(this);
    },


    subviewCreators : {
        publicTimeline: function(a,b,c) {
            return new Application.View.Items({
                pid: session.get('pid'),
                collection: this.options.publicItems
            });
        },

        privateTimeline: function() {
            return new Application.View.Items({
                pid: session.get('pid'),
                collection: this.options.privateItems
            });
        }
    }
});