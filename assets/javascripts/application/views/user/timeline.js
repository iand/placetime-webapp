Application.View.Timeline = Marionette.ItemView.extend({
    template: '#timeline-template',

    initialize: function() {
        Backbone.Subviews.add(this);
    },


    subviewCreators : {
        publicTimeline: function() {
            var foo = new Application.View.Items({
                model: new Backbone.Model({
                    status: 'p',
                    pid: this.options.pid
                }),
                collection: this.options.publicItems
            });

            foo.on('promote', function(){
                console.log('test');
            });

            return foo;
        },

        privateTimeline: function() {
            var foo = new Application.View.Items({
                model: new Backbone.Model({
                    status: 'm',
                    pid: this.options.pid
                }),
                collection: this.options.privateItems
            });

            return foo;
        }
    }
});