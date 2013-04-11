Application.View.Followers = Backbone.Marionette.CompositeView.extend({
    template: '#followers-template',
    className: 'followers',

    itemView: Application.View.Follower,

    events: {
        'click .unfollow': 'unfollow',
        'click .follow': 'follow'
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
    }
});