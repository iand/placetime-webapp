var FollowersList = Backbone.Collection.extend({
    model: Application.Model.Profile,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jfollowers?count=40&pid=' + this.pid;
    }
});