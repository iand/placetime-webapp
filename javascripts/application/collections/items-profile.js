Application.Collection.ItemsProfile = Backbone.Collection.extend({
    model: Application.Model.Item,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jtl?status=m&before=100&after=100&pid=' + this.pid;
    }
});