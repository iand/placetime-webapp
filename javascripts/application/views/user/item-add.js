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


    ui: {
        form: '.item-add-form',
        title: '.item-add-title',
        type: '.item-add-type',
        event: '.item-add-event',
        hasEvent: '.item-add-has-event',
        duration: '.item-add-duration',
        error: '.form-error',

        mediaInput: 'input[name=media]',
        textInput: 'input[name=text]',
        imageInput: 'input[name=image]',
        durationInput: 'input[name=duration]',

        imageList: '.item-add-image-list',
        imageBest: '.item-add-image-best',
        imageEmpty: '.item-add-image-list-empty',
        imageControls: '.item-add-image-controls',

        loading: '.item-add-loading',
        controls: '.item-add-controls'
    },



    initialize: function(options) {
        this.model.set({
            alternates: [],
            loading: true,
            text: '',
            event: '',
            media: 'video'
        });
    },



    changeMedia: function(event) {
        var $target = $(event.target).closest('.item-add-media-type');

        $target.siblings().removeClass('item-add-media-type-is-selected');
        $target.addClass('item-add-media-type-is-selected');

        this.ui.mediaInput.val($target.data('type'));
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
        var $current = this.ui.imageList.find('.item-add-image-list-current');


        var $next = $current.next('.item-add-image-list-item');

        if ($next.length === 0) {
            $next = this.ui.imageList.find('.item-add-image-list-item').first();
        }

        $next.addClass('item-add-image-list-current');
        $current.removeClass('item-add-image-list-current');

        this.ui.imageInput.val($next.data('image'));

        return false;
    },



    prev: function() {
        var $current = this.ui.imageList.find('.item-add-image-list-current');


        var $prev = $current.prev('.item-add-image-list-item');

        if ($prev.length === 0) {
            $prev = this.ui.imageList.find('.item-add-image-list-item').last();
        }


        $prev.addClass('item-add-image-list-current');
        $current.removeClass('item-add-image-list-current');

        this.ui.imageInput.val($prev.data('image'));

        return false;
    },



    onShow: function() {
        if (Modernizr.inputtypes.date === false) {
            $('input[type=date]').datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'yy-mm-dd'
            });
        }

        this.ui.title.find('input').focus();
    },



    onRender: function() {
        var self = this;


        var promise = this.model.detect();

        promise.done(function(data) {
            // Text
            self.ui.textInput.val(data.title);

            // Best image
            self.ui.imageBest.css('background-image', 'url(/-img/'+data.bestImage+')');
            self.ui.imageBest.data('image', data.bestImage);
            self.ui.imageInput.val(data.bestImage);

            if (data.alternates.length > 0) {
                // Alternate images
                $.each(data.alternates, function(index, alternate){
                    var $li = $('<li />').addClass('item-add-image-list-item');
                        $li.css('background-image', 'url('+alternate.url+')');
                        $li.data('image', alternate.url);

                    self.ui.imageList.append($li);
                });

                self.ui.imageControls.show();
                self.ui.imageList.show();
                self.ui.imageEmpty.hide();
            } else {
                self.ui.imageEmpty.show();
            }

            self.ui.loading.hide();
        });


        promise.fail(function() {
            self.ui.loading.hide();
            self.ui.imageEmpty.show();
        });
    },



    onClose: function() {
        $('input[type=date]').datepicker('destroy');
    }
});