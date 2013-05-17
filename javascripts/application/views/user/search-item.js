Application.View.SearchItem = Application.View.TimelineItem.extend({
    template: '#search-template',

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

        getIframeUrl: function(url) {
            if (/youtube/.test(url) === true) {
                return 'http://www.youtube.com/embed/' + url.replace(
                    'https://gdata.youtube.com/feeds/api/videos/', ''
                );
            }
        }
    },

    attributes: function() {
        var attributes = {
            'data-id': this.model.id
        };

        if (this.model.get('image')) {
            attributes.style = 'background-image: url(' + this.model.get('image') + ')';
        }

        return attributes;
    },


    className: function() {
        var className = 'item collapsed';

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