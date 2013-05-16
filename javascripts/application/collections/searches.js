Application.Collection.Searches = Backbone.Collection.extend({
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

        // Set model based on request type
        if (options.data.t === 'i') {
            this.model = Application.Model.SearchItem;
        } else {
            this.model = Application.Model.SearchProfile;
        }


        promise.done(function(data){
            self.set(data.results);
        });

        promise.fail(function(){
            // TODO: Display errors
        });


        return promise;
    },


    comparator: function(model) {
        return -model.get('ts');
    }
});