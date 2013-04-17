Application.View.Followers = Backbone.Marionette.CompositeView.extend({
    template: '#followers-template',
    className: 'followers',

    itemView: Application.View.Follower,
    itemViewContainer: '.children',

    events: {
        'click .unfollow': 'unfollow',
        'click .follow': 'follow'
    },


   initialize: function (options) {
        this.on('infinite:load', this.loadMore);
    },


    onRender: function() {
        this.collection.fetch({
            data: {
                pid: this.model.get('pid'),
                count: this.model.get('count')
            },
            reset: true
        });
    },


    follow: function(event) {
        var $profile = $(event.currentTarget).closest('[data-pid]');

        var model = this.collection.get(
            $profile.data('pid')
        );

        model.follow();
    },


    unfollow: function(event) {
        var $profile = $(event.currentTarget).closest('[data-pid]');

        var model = this.collection.get(
            $profile.data('pid')
        );

        model.unfollow();
    },


    loadMore: function(options){
        if (options.before) {
            return;
        }


        var self = this;

        var data = {
            pid: self.model.get('pid'),
            start: self.model.get('start'),
            count: 10
        };

        self.collection.fetch({
            remove: false,
            data: data
        }).done(function(data){
            if (data.length > 0) {
                self.model.set('start', data.start + 10);
            }

            self.trigger('infinite:loaded');
        }).fail(function(){
            self.trigger('infinite:failed');
        });
    }
});