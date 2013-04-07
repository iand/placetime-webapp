Application.Collection.Feeds = Backbone.Collection.extend({
    model: Application.Model.Feed,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jfeeds?pid=' + this.pid;
    }
});