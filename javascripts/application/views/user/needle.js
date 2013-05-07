Application.View.Needle = Backbone.Marionette.ItemView.extend({
    template: '#needle-now-template',
    className: 'needle',

    isRendered: false,

    initialize: function (options) {
        this.on('scroll', this.scroll);
    },


    scroll: function(event) {
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

        this.rotate(event);
    },


    rotate: function(event) {
        var $scroller = $(event.target);

        this.$el.find('.icon-repeat').css({
            '-webkit-transform': 'rotate('+$scroller.scrollTop()+'deg)'
        });
    },


    update: function(time, format, prefix, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';

        // Re-render as needle-template
        if (this.template !== '#needle-template') {
            this.template = '#needle-template';
            this.render();
        }

        this.$el.find('.value').text(
            prefix + time.format(format) + suffix
        );
    },


    now: function() {
        this.template = '#needle-now-template';
        this.render();
    },


    onRender: function() {
        this.isRendered = true;
    }
});