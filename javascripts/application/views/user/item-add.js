Application.View.ItemAdd = Backbone.Marionette.ItemView.extend({
    template: '#item-add-template',
    className: 'item item-add',

    events: {
        'submit item-add-form': 'submit',
        'click .item-add-event input': 'event',
        'click .item-add-type input': 'toggle',
        'click .cancel': 'cancel'
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
        error: '.form-error'
    },


    templateHelpers: {
        getDuration: Application.Helpers.getDuration
    },


    initialize: function(options) {
        this.model.set({
            link: '',
            text: '',
            ets: ''
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
    }
});