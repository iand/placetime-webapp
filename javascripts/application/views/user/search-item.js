Application.View.SearchItem = Application.View.TimelineItem.extend({
    template: '#search-item-template',

    templateHelpers: {
        isEvent: function(event) {
            var model = new Application.Model.SearchItem({
                event: event
            });

            return model.isEvent();
        },

        time: function(event, added) {
            var model = new Application.Model.SearchItem({
                event: event,
                added: added
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
                hours   = duration.diff(current, 'hours') - (days * 24),
                minutes = duration.diff(current, 'minutes') - (hours * 60),
                seconds = duration.diff(current, 'seconds') - (minutes * 60);

            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        },

        getIframeUrl: function(url) {
            if (/youtube/.test(url) === true) {
                return 'http://www.youtube.com/embed/' + url.replace(
                    'https://gdata.youtube.com/feeds/api/videos/', ''
                );
            }
        },

        getSpotifyUrl: function(url) {
            return 'https://embed.spotify.com/?uri=' + url;
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

        if (this.model.isAdded()) {
            className += ' added';
        }

        // Time
        if (this.model.isPast()) {
            className += ' past';
        }

        return className;
    }
});