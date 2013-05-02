Application.View.Needle = Backbone.Marionette.ItemView.extend({
    template: '#needle-template',
    className: 'needle',

    isRendered: false,

    initialize: function (options) {
        this.on('scroll', this.scroll);
    },


    scroll: function() {
        var offset = this.$el.offset();

        // Get element below needle
        var $item = $(document.elementFromPoint(
            offset.left,
            offset.top + 4
        )).closest('.item');

        if ($item.length === 0) {
            return;
        }


        var model = $item.data('model'),
            time = $item.data('model').time();


        // Now
        if (model.isNow() === true) {
            this.now();
        }

        else if (model.isToday() === true) {
            this.update(time, ' hh:mm:ss A', 'Today at ');
        }

        else if (model.isEvent() === true) {
            this.update(time, 'Do MMMM YYYY');
        }

        else {
            this.update(time, 'Do MMMM YYYY hh:mm:ss A');
        }
    },


    update: function(time, format, prefix, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';

        this.$el.find('.date').text(
            prefix + time.format(format) + suffix
        );
    },


    now: function() {
        var now = new Application.View.NeedleNow();
            now.render();

        this.$el.html(now.el);
    },


    onRender: function() {
        this.isRendered = true;
    }
});