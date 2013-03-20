Application.Collection.Items = Backbone.Collection.extend({
    model: Application.Model.Item,
    url: '/-jtl',

    refresh: function () {
        var url = '/-jtl?count=40&pid=' + this.pid + '&status=' + this.status + '&order=' + this.order;
        var self = this;
        $.ajax({
            url: url,
            dataType: "json",
            success: function (data) {
                console.log("refresh retrieved " + data.length + " items");
                _.each(data, function (item) {
                    var dt = moment(item.ms);
                    item.year = dt.year();
                    item.month = dt.month();
                    item.day = dt.date();
                    item.hours = dt.hours();
                    item.minutes = dt.minutes();
                    item.seconds = dt.seconds();
                    item.fromnow = dt.fromNow();
                    item.diff = moment().diff(dt);
                });
                console.log("resetting");
                self.reset(data);
            }
        });
    },


    fetch: function(options) {
        var self = this;

        var promise = $.ajax({
            url: this.url + '?' + $.param(options.data),
            dataType: 'json'
        });

        promise.done(function(data){
            console.log("refresh retrieved " + data.length + " items");
            _.each(data, function (item) {
                var dt = moment(item.ms);
                item.year = dt.year();
                item.month = dt.month();
                item.day = dt.date();
                item.hours = dt.hours();
                item.minutes = dt.minutes();
                item.seconds = dt.seconds();
                item.fromnow = dt.fromNow();
                item.diff = moment().diff(dt);
            });
            console.log("resetting");
            self.reset(data);
        });

        return promise;
    },


    comparator: function(model) {
        return -moment(model.get('ets')).unix();
    }
});