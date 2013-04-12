Application.View.Followings = Backbone.Marionette.CompositeView.extend({
    template: '#followers-template',
    className: 'followings',

    itemView: Application.View.Following,
    itemViewContainer: '.children',

    events: {
        'click .unfollow': 'unfollow'
    },


    unfollow: function(event) {
        var $profile = $(event.currentTarget).closest('[data-pid]');

        var model = this.collection.get(
            $profile.data('pid')
        );

        model.unfollow();
    }
});