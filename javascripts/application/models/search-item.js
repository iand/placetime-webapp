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
    }
});