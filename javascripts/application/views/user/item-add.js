Application.View.ItemAdd = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['item-add']
    },
    className: 'item item-add',

    events: {
        'submit .item-add-form': 'submit',

        'click .item-add-media-type': 'changeMedia',
        'click .item-add-has-event input': 'toggleEvent',
        'click .item-add-type input': 'toggleType',
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
        media: '.item-add',
        hasEvent: '.item-add-has-event',
        duration: '.item-add-duration',
        error: '.form-error',

        list: '.item-add-image-list',
        controls: '.item-add-controls'
    },


    initialize: function(options) {
        var self = this;

        this.model.set({
            alternates: [],
            loading: true,
            text: '',
            event: '',
            media: 'video'
        });


        var promise = this.model.detect();

        promise.done(function(data) {
            self.model.set('text', data.title);

            if (data.alternates && data.alternates.length > 0) {
                self.model.set('alternates', data.alternates);
            }

            self.model.set('image', '/-img/' + data.bestImage);
        });

        promise.always(function(){
            self.model.set('loading', false);
        });
    },


    changeMedia: function(event) {
        var $target = $(event.target).closest('.item-add-media-type');

        $target.siblings().removeClass('item-add-media-type-is-selected');
        $target.addClass('item-add-media-type-is-selected');

        this.model.set('media', $target.data('type'));
    },


    toggleEvent: function() {
        this.ui.event.toggle();
        this.ui.event.find('input').val(null);
    },


    toggleType: function(event) {
        var value = $(event.target).val();

        if (value === 'text') {
            this.ui.duration.hide();
        } else {
            this.ui.duration.show();
        }

        if (value === 'event') {
            this.ui.event.show();
        } else {
            this.ui.event.hide();
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

        this.model.set(
            'image', $next.css('background-image'),
            {
                silent: true
            }
        );

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

        this.model.set(
            'image', $prev.css('background-image'),
            {
                silent: true
            }
        );

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
    },

    onClose: function() {
        $('input[type=date]').datepicker('destroy');
    }
});