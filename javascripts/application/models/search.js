Application.Model.Search = Backbone.Model.extend({
    idAttribute: 'uid',

    initialize: function() {
        this.set('uid', this.get('id') + '-' + this.get('ts'), {
            silent: true
        });
    },


    time: function() {
        if (this.isEvent() === true) {
            return moment.unix(
                this.get('event')
            );
        } else {
            return moment.unix(
                this.get('added')
            );
        }
    },


    isPast: function() {
        return this.time().diff() < 0;
    },


    isToday: function() {
        return Math.abs(this.time().diff()) < moment().add('day', 1).diff();
    },


    isEvent: function() {
        return this.get('event') !== 0;
    },


    isVideo: function() {
        return this.get('media') === 'video';
    },


    isAudio: function() {
        return this.get('media') === 'audio';
    },


    isAdded: function() {
        return this.get('added') !== 0;
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