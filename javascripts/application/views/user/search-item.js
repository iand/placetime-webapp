Application.View.SearchItem = Application.View.TimelineItem.extend({
    template: '#search-item-template',

    templateHelpers: {
        time: Application.Helpers.time,
        url: Application.Helpers.url,

        hasEvent: Application.Helpers.hasEvent,
        isEvent: Application.Helpers.isEvent,
        isAdded: Application.Helpers.isAdded,

        getDuration: Application.Helpers.getDuration,

        getYoutubeUrl: Application.Helpers.getYoutubeUrl,
        getSpotifyUrl: Application.Helpers.getSpotifyUrl,

        isYoutube: Application.Helpers.isYoutube,
        isSpotify: Application.Helpers.isSpotify
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
        } else if (this.model.isText()) {
            className += ' text';
        }

        // Time
        if (this.model.isPast()) {
            className += ' past';
        }

        return className;
    }
});