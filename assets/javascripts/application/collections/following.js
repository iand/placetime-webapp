var FollowingList = Backbone.Collection.extend({
    model: Profile,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jfollowing?count=40&pid=' + this.pid;
    }
});