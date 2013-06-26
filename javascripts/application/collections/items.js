Application.Collection.Items = Backbone.Collection.extend({
    model: Application.Model.Item,
    url: '/-jtl',


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
                self.each(function(model){
                    model.now = false;
                });

                var model = self.get(data[0].id);
                    model.now = true;

                defer.resolve(model);
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