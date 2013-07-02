Application.View.ItemAdd = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['item-add']
    },
    className: 'item item-add',

    events: {
        'submit .item-add-form': 'submit',
        'click .item-add-event input': 'event',
        'click .item-add-type input': 'toggle',
        'click .item-add-btn-cancel': 'cancel',

        'click .item-add-image-controls-next': 'next',
        'click .item-add-image-controls-prev': 'prev'
    },

    modelEvents: {
        'change': 'render'
    },

    ui: {
        form: '.item-add-form',
        title: '.item-add-title',
        type: '.item-add-type',
        event: '.item-add-event',
        ets: '.item-add-ets',
        duration: '.item-add-duration',
        error: '.form-error',

        list: '.item-add-image-list',
        controls: '.item-add-controls'
    },


    initialize: function(options) {
        var self = this;


        this.model.set({
            loading: true,
            link: '',
            text: '',
            ets: ''
        });


        var promise = this.model.detect();

        promise.done(function(data) {
            self.model.set('images', data.images);
        });

        promise.always(function(){
            self.model.set('loading', false);
        });
    },


    event: function() {
        this.ui.ets.toggle();
        this.ui.ets.find('input').val(null);
    },


    toggle: function(event) {
        var value = $(event.target).val();

        if (value === 'text') {
            this.ui.duration.hide();
        } else {
            this.ui.duration.show();
        }

        if (value === 'event') {
            this.ui.ets.show();
        } else {
            this.ui.ets.hide();
        }
    },


    submit: function(event) {
        var data = this.ui.form.serializeObject();

        var self    = this;
        var promise = this.model.set(data).save();

        promise.done(function(){
            self.trigger('created');
        });

        promise.fail(function(){
           // TODO: Display errors
        });

        return false;
    },


    cancel: function() {
        this.trigger('cancelled');

        return false;
    },


    next: function() {
        var $current = this.ui.list.find('.item-add-image-list-current');


        var $next = $current.next();

        if ($next.length === 0) {
            $next = this.ui.list.find('.item-add-image-list-item').first();
        }

        $next.addClass('item-add-image-list-current');
        $current.removeClass('item-add-image-list-current');

        return false;
    },


    prev: function() {
        var $current = this.ui.list.find('.item-add-image-list-current');


        var $prev = $current.prev();

        if ($prev.length === 0) {
            $prev = this.ui.list.find('.item-add-image-list-item').last();
        }


        $prev.addClass('item-add-image-list-current');
        $current.removeClass('item-add-image-list-current');

        return false;
    },


    onShow: function(){
        if (Modernizr.inputtypes.date === false) {
            $('input[type=date]').datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'mm/dd/yy'
            });
        }

        this.ui.title.find('input').focus();

        this.$el.find('select, input[type=radio], input[type=checkbox]').uniform({
            useID: false
        });
    },

    onClose: function() {
        $('input[type=date]').datepicker('destroy');

        $.uniform.restore('select');
        $.uniform.restore('input[type=radio]');
        $.uniform.restore('input[type=checkbox]');
    }
});