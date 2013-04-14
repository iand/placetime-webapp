Application.Model.Item = Backbone.Model.extend({
    idAttribute: 'uid',

    defaults: {
        now: false
    },

    initialize: function() {
        this.set('uid', this.get('id') + '-' + this.get('ts'));
    },

    time: function() {
        return moment.unix(
            this.get('ts').toString().substr(0, 10)
        );
    },


    save: function(done, fail) {
        var promise = $.ajax({
            url: '/-tadd',
            type: 'post',
            data: {
                pid: session.get('pid'),
                link: this.get('link'),
                text: this.get('text'),
                ets: '1 Jan 2006' // TODO: Get Ian to fix
            }
        });

        promise.done(done);
        promise.fail(fail);

        return promise;
    },


    promote: function(done, fail) {
        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        this.trigger('item:promoted', this);

        $.ajax({
            url: '/-tpromote',
            type: 'post',
            data: {
                pid: session.get('pid'),
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

        this.trigger('item:demoted', this);

        $.ajax({
            url: '/-tdemote',
            type: 'post',
            data: {
                pid: session.get('pid'),
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