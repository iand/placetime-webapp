Application.Collection.Items = Backbone.Collection.extend({
    model: Application.Model.Item,
    url: '/-jtl',

    initialize: function(collection, options) {
        this.order = options.order;
    },


    comparator: function(model) {
        if (this.order === 'ets') {
            return -moment(model.get('ets')).unix();
        } else {
            return -moment(model.get('ts')).unix();
        }
    }
});