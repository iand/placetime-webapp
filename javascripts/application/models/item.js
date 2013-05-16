Application.Model.Item = Backbone.Model.extend({
    idAttribute: 'uid',

    // Non-attributes
    now: false,

    initialize: function() {
        this.set('uid', this.get('id') + '-' + this.get('ts'), {
            silent: true
        });
    },

    defaults: {
        source: undefined
    },


    idSafe: function() {
        return this.id.replace(/@/, '\\@');
    },


    time: function() {
        return moment.unix(
            this.get('ts').toString().substr(0, 10)
        );
    },


    isNow: function() {
        return this.now;
    },


    isPast: function() {
        return this.time().diff() < 0;
    },


    isToday: function() {
        return Math.abs(this.time().diff()) < moment().add('day', 1).diff();
    },


    isEvent: function() {
        return this.get('ts').toString().substr(0, 10) == this.get('event');
    },


    isVideo: function() {
        return this.get('media') === 'video';
    },


    isAudio: function() {
        return this.get('media') === 'audio';
    },


    isAdded: function() {
        return this.get('ts').toString().substr(0, 10) == this.get('added');
    },


    save: function(done, fail) {
        var promise = $.ajax({
            url: '/-tadd',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                link: this.get('link'),
                text: this.get('text'),
                ets: this.get('ets')
            }
        });

        promise.done(done);
        promise.fail(fail);

        return promise;
    },


    promote: function(done, fail) {
        var self = this;


        var promise = $.ajax({
            url: '/-tpromote',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                id: this.get('id')
            }
        });

        promise.done(function(data) {
            self.trigger('item:promoted', data);
        });

        promise.done(done);
        promise.fail(fail);

        return promise;
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
                pid: Application.session.get('pid'),
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