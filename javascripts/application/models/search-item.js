Application.Model.SearchItem = Application.Model.Item.extend({
    initialize: function() {
        this.set('uid', this.get('id') + '-' + this.get('ts'), {
            silent: true
        });
    },


    time: function() {
        if (this.isEvent() === true) {
            return moment.unix(
                this.get('event').toString().substr(0, 10)
            );
        } else {
            return moment.unix(
                this.get('added').toString().substr(0, 10)
            );
        }
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
        return this.get('media') === 'event';
    },


    isVideo: function() {
        return this.get('media') === 'video';
    },


    isAudio: function() {
        return this.get('media') === 'audio';
    },


    add: function() {
        var promise = $.ajax({
            url: '/-tadd',
            type: 'post',
            data: {
                pid: Application.session.get('pid'),
                link: this.get('link'),
                text: this.get('text'),
                image: this.get('image'),
                media: this.get('media'),
                ets: this.get('ets'),
                duration: this.get('duration')
            }
        });

        this.trigger('item:added', this.attributes);

        return promise;
    }
});