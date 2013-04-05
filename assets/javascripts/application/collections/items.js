Application.Collection.Items = Backbone.Collection.extend({
    model: Application.Model.Item,
    url: '/-jtl',


    initialize: function(collection, options) {
        this.options = options;
    },


    fetch: function(options) {
        options.data = _.extend(this.options, options.data);

        return Backbone.Collection.prototype.fetch.call(this, options);
    },


    now: function(){
        var self = this;

        var sorted = _.sortBy(this.models, function(model) {
            return model.get('ts');
        });

        return sorted[0];
    },


    comparator: function(model) {
        return -model.get('ts');
    }
});