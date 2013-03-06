var ProfileItems = Backbone.Collection.extend({
    model: Item,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jtl?status=m&count=30&pid=' + this.pid;
    }
});