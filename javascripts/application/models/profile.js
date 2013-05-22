Application.Model.Profile = Backbone.Model.extend({
    defaults: {
        name: undefined,
        bio: undefined,
        email: undefined,
        profileimageurl: undefined
    },

    idAttribute: 'pid',

    url: function() {
        return '/-jpr?pid=' + this.get('pid');
    },


    save: function(done, fail) {
        this.trigger('updated', this.attributes);

        var promise = $.ajax({
            url: '/-tupdateprofile',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                name: this.get('name'),
                feedurl: this.get('feedurl'),
                bio: this.get('bio'),
                email: this.get('email')
            }
        });


        promise.done(done);
        promise.fail(fail);

        return promise;
    },


    follow: function() {
        this.collection.trigger('profile:follow', this.attributes);
        this.trigger('followed', this.attributes);

        var promise = $.ajax({
            url: '/-tfollow',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                followpid: this.get('pid')
            }
        });

        return promise;
    },




    unfollow: function() {
        this.collection.trigger('profile:unfollow', this.attributes);
        this.collection.remove(this);

        this.trigger('unfollowed', this.attributes);

        var promise = $.ajax({
            url: '/-tunfollow',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                followpid: this.get('pid')
            }
        });

        return promise;
    }
});