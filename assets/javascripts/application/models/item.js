Application.Model.Item = Backbone.Model.extend({
    idAttribute: 'id',

    time: function() {
        return moment.unix(
            this.get('ts').toString().substr(0, 10)
        );
    },


    promote: function(done, fail) {
        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        $.ajax({
            url: '/-tpromote',
            type: 'post',
            data: {
                pid: session.get("pid"),
                id: this.get('id')
            },
            success: function() {
                defer.resolve();
            },
            failure: function() {
                defer.reject();
            }
        });

        return defer.promise();
    },


    demote: function(done, fail) {
        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        $.ajax({
            url: '/-tdemote',
            type: 'post',
            data: {
                pid: session.get("pid"),
                id: this.get('id')
            },
            success: function() {
                defer.resolve();
            },
            failure: function() {
                defer.reject();
            }
        });

        return defer.promise();
    }
});

var Item = Backbone.Model.extend({

});