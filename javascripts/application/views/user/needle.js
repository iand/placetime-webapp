Application.View.Needle = Backbone.Marionette.ItemView.extend({
    template: '#needle-now-template',
    className: 'needle',

    isRendered: false,

    initialize: function (options) {
        this.on('scroll', this.rotate);
        this.on('scroll', this.update);
    },


    update: function() {
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
            this.updateText(time, ' hh:mm:ss A', 'Today at ');
        }

        else if (model.isEvent() === true) {
            this.updateText(time, 'Do MMMM YYYY');
        }

        else {
            this.updateText(time, 'Do MMMM YYYY hh:mm:ss A');
        }
    },


    rotate: function(event) {
        var scrollTop = $(event.target).scrollTop();

        this.$el.find('.icon-repeat').css({
            '-webkit-transform' : 'rotate(-'+scrollTop+'deg)',
            '-moz-transform'    : 'rotate(-'+scrollTop+'deg)',
            '-o-transform'      : 'rotate(-'+scrollTop+'deg)',
            '-ms-transform'     : 'rotate(-'+scrollTop+'deg)',
            'transform'         : 'rotate(-'+scrollTop+'deg)'
        });
    },




    updateText: function(time, format, prefix, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';

        // Re-render as needle-template
        if (this.template !== '#needle-template') {
            this.template = '#needle-template';
            this.render();
        }

        var $value = this.$el.find('.value');

        if ($value.text() !== prefix + time.format(format) + suffix) {
            $value.text(prefix + time.format(format) + suffix);
        }
    },


    now: function() {
        this.template = '#needle-now-template';
        this.render();
    },


    onRender: function() {
        this.update();
        this.isRendered = true;
    }
});