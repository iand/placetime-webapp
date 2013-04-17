Application.View.Needle = Backbone.Marionette.ItemView.extend({
    template: '#needle-template',
    className: 'needle',

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
        if (model.get('now') === true) {
            this.now();
        }

        // Today
        else if (Math.abs(time.diff()) < moment().add('day', 1).diff()) {
            this.update(time, ' hh:mm:ss A', 'Today at ');
        }

        // Future/Past
        else {
            this.update(time, 'Do MMMM YYYY');
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
    }
});