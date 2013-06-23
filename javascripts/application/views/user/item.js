Application.View.Item = Application.View.TimelineItem.extend({
    template: '#item-template',

    templateHelpers: {
        isEvent: function(ts, event) {
            var model = new Application.Model.Item({
                ts: ts,
                event: event
            });

            return model.isEvent();
        },

        time: function(ts) {
            var model = new Application.Model.Item({
                ts: ts
            });

            return model.time();
        },

        url: function(id) {
            return window.location.origin + '/item/' + id;
        },

        getDuration: function(secs) {
            var current = moment(),
                duration = moment();

            duration.add('seconds', secs);

            var days    = duration.diff(current, 'days'),
                hours   = duration.diff(current, 'hours'),
                minutes = duration.diff(current, 'minutes'),
                seconds = duration.diff(current, 'seconds');

            return {
                days: days,
                hours: (hours  - (days * 24)),
                minutes: (minutes - (hours * 60)),
                seconds: (seconds - (minutes * 60))
            };
        },

        // TODO: Abstract
        getYoutubeUrl: function(url) {
            return 'http://www.youtube.com/embed/' + url.replace(
                'https://gdata.youtube.com/feeds/api/videos/', ''
            );
        },

        getSpotifyUrl: function(url) {
            return 'https://embed.spotify.com/?uri=' + url;
        },

        isYoutube: function(url) {
            return (/youtube\./).test(url);
        },

        isSpotify: function(url) {
            return (/spotify\./).test(url);
        }
    },


    className: function() {
        var className = 'item';

        if (this.model.get('image')) {
            className += ' image';
        }

        // Type
        if (this.model.isEvent()) {
            className += ' event';
        } else if (this.model.isVideo()) {
            className += ' video';
        } else if (this.model.isAudio()) {
            className += ' audio';
        }

        // Time
        if (this.model.isPast()) {
            className += ' past';
        }

        if (this.model.get('promoted') === true) {
            className += ' collapsed';
        }

        return className;
    },


    onShow: function() {
        if (this.model.get('promoted') === true) {
            this.$el.offset();
            this.$el.removeClass('collapsed');
        }
    }
});