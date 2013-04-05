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

        var options = {
            data: {
                pid: this.options.pid,
                status: this.options.status
            },
            remove: false
        };


        var defer = $.Deferred();

        Backbone.Collection.prototype.fetch.call(this, options).done(function(data){
            if (data.length === 0) {
                defer.reject();
            } else {
                defer.resolve(
                    self.get(data[0].id)
                );
            }
        }).fail(function(){
            defer.reject();
        });

        return defer.promise();
    },


    comparator: function(model) {
        return -model.get('ts');
    }
});