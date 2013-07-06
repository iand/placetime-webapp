Application.View.FollowerEmpty = Application.View.TimelineProfile.extend({
    template: {
        type: 'handlebars',
        template: JST['follower-empty']
    },
    className: 'item item-profile item-empty'
});