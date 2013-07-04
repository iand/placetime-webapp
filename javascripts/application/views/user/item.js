Application.View.Item = Application.View.TimelineItem.extend({
    template: {
        type: 'handlebars',
        template: JST['item']
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