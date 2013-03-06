var FeedsList = Backbone.Collection.extend({
    model: Feed,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jfeeds?pid=' + this.pid;
    }
});