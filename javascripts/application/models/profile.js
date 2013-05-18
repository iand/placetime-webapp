Application.Model.Profile = Backbone.Model.extend({
    defaults: {
        name: undefined,
        bio: undefined,
        email: undefined
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
        this.trigger('follow', this.attributes);

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

        this.trigger('unfollow', this.attributes);

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