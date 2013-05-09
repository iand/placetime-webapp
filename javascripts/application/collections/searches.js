Application.Collection.Searches = Backbone.Collection.extend({
    model: Application.Model.Search,
    url: '/-jsearch',


    initialize: function(collection, options) {
        this.options = options || {};

        this.on('item:demoted', function(target) {
            var models = this.filter(function(item) {
                return (item.get('id') === target.get('id'));
            });

            this.remove(models);
        });
    },


    search: function(options) {
        var self = this;


        var promise = $.ajax({
            url: this.url,
            type: 'get',
            dataType: 'json',
            data: options.data
        });


        promise.done(function(data){
            self.set(data.items);
        });

        promise.fail(function(){
            // TODO
        });


        return promise;
    },


    comparator: function(model) {
        return -model.get('ts');
    }
});