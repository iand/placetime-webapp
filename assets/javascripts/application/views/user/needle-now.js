Application.View.NeedleNow = Backbone.Marionette.ItemView.extend({
    template: '#needle-now-template',

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

        var model = $item.data('model');

        var time = model.time();

        // Now
        if (model.get('now') === true) {
            console.log('now');
        }

        // Today
        else if (Math.abs(time.diff()) < moment().add('day', 1).diff()) {
            this.$el.find('.date').text(
                'Today at ' +time.format(' hh:mm:ss A')
            );
        }

        // Future/Past
        else {
            this.$el.find('.date').text(
                time.format('Do MMMM YYYY')
            );
        }
    },


    now: function() {

    }
});