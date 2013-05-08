Application.Collection.Searches = Backbone.Collection.extend({
    model: Application.Model.Search,
    url: '/-jsearch',


    initialize: function(collection, options) {
        this.options = options;

        this.on('item:demoted', function(target) {
            var models = this.filter(function(item) {
                return (item.get('id') === target.get('id'));
            });

            this.remove(models);
        });
    },


    fetch: function(options) {
        options.data = _.extend(this.options, options.data);

        return Backbone.Collection.prototype.fetch.call(this, options);
    },


    comparator: function(model) {
        return -model.get('ts');
    }
});