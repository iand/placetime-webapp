Application.View.Needle = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['needle-now']
    },
    templateCurrent: 'needle-now',

    className: 'needle',

    initialize: function (options) {
        this.on('scroll', this.rotate);
        this.on('scroll', this.update);
        this.on('update', this.update);
    },


    update: function() {
        var offset = this.$el.offset();

        // Get element below needle
        var $item = $(document.elementFromPoint(
            offset.left,
            offset.top + 6
        )).closest('.item');

        if ($item.length === 0) {
            return;
        }


        var model = $item.data('model');

        if (model === undefined) {
            return;
        }

        var time = $item.data('model').time();

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

        this.$el.find('.needle-icon-repeat').css({
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
        if (this.templateCurrent !== 'needle') {
            this.templateCurrent   = 'needle';
            this.template.template = JST['needle'];
            this.render();
        }

        var $value = this.$el.find('.needle-value');

        if ($value.text() !== prefix + time.format(format) + suffix) {
            $value.text(prefix + time.format(format) + suffix);
        }
    },


    now: function() {
        this.templateCurrent   = 'needle-now';
        this.template.template = JST['needle-now'];
        this.render();
    },


    onShow: function() {
        this.update();
    }
});