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


    save: function() {
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

        return promise;
    },


    destroy: function() {
        this.trigger('updated', this.attributes);

        var promise = $.ajax({
            url: '/-tremprofile',
            type: 'post',
            data: {
                pid: Application.session.get('pid')
            }
        });

        return promise;
    },


    flag: function() {
        this.trigger('flagged', this.attributes);

        var promise = $.ajax({
            url: '/-tflagprofile',
            type: 'post',
            data: {
                pid: this.get('pid')
            }
        });

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