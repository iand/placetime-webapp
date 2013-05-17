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
        }
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