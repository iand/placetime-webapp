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
        via: undefined
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


    isAdded: function() {
        return this.get('ts').toString().substr(0, 10) == this.get('added');
    },


    isVideo: function() {
        return this.get('media') === 'video';
    },


    isAudio: function() {
        return this.get('media') === 'audio';
    },


    save: function() {
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



    promote: function() {
        var self = this;

        var promise = $.ajax({
            url: '/-tpromote',
            type: 'post',
            dataType: 'json',
            data: {
                pid: Application.session.get('pid'),
                id: this.get('id')
            }
        });

        promise.done(function(data){
            _.each(data, function(item){
                item.promoted = true;
            });

            self.trigger('item:promoted', data);
        });

        return promise;
    },



    demote: function() {
        var self = this;

        var promise = $.ajax({
            url: '/-tdemote',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                id: this.get('id')
            }
        });

        promise.done(function(data){
            _.each(data, function(item){
                item.demoted = true;
            });

            self.trigger('item:demoted', self);
        });

        return promise;
    }
});