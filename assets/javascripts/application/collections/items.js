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

        var sorted = _.sortBy(this.models, function(model){
            var diff = moment().diff(
                model.get(self.options.order)
            );

            return Math.abs(diff);
        });

        return sorted[0];
    },


    comparator: function(model) {
        if (this.order === 'ets') {
            return -moment(model.get('ets')).unix();
        } else {
            return -moment(model.get('ts')).unix();
        }
    }
});