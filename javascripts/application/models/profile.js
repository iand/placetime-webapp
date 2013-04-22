Application.Model.Profile = Backbone.Model.extend({
    defaults: {
        bio: false
    },

    idAttribute: 'pid',

    url: function() {
        return '/-jpr?pid=' + this.get('pid');
    },




    follow: function(done, fail) {
        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        this.collection.trigger('profile:follow', this.attributes);
        this.trigger('follow', this.attributes);

        $.ajax({
            url: '/-tfollow',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                followpid: this.get('pid')
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




    unfollow: function(done, fail) {
        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        this.collection.trigger('profile:unfollow', this.attributes);
        this.collection.remove(this);

        this.trigger('unfollow', this.attributes);

        $.ajax({
            url: '/-tunfollow',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                followpid: this.get('pid')
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