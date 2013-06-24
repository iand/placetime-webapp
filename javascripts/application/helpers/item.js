Application.Helpers = {
    isEvent: function(media) {
        var model = new Application.Model.Item({
            media: media
        });

        return model.isEvent();
    },


    isAdded: function(ts, added) {
        var model = new Application.Model.Item({
            ts: ts,
            added: added
        });

        return model.isAdded();
    },


    time: function(ts, event, added) {
        var model = new Application.Model.Item({
            ts: ts,
            event: event,
            added: added
        });

        return model.time();
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
    },

    url: function(id) {
        return window.location.origin + '/item/' + id;
    }
};