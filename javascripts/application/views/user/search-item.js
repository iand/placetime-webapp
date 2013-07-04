Application.View.SearchItem = Application.View.TimelineItem.extend({
    template: {
        type: 'handlebars',
        template: JST['search-item']
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