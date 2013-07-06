Application.View.FollowingEmpty = Application.View.TimelineProfile.extend({
    template: {
        type: 'handlebars',
        template: JST['following-empty']
    },
    className: 'item item-profile item-empty'
});