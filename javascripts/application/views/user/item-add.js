Application.View.ItemAdd = Backbone.Marionette.ItemView.extend({
    template: '#item-add-template',
    className: 'item item-add',

    events: {
        'submit item-add-form': 'submit',
        'click .item-add-event input': 'toggle',
        'click .cancel': 'cancel'
    },

    modelEvents: {
        'change': 'render'
    },

    ui: {
        form: '.item-add-form',
        event: '.item-add-event',
        ets: '.item-add-ets',
        error: '.form-error'
    },

    initialize: function(options) {
        this.model.set({
            link: '',
            text: '',
            ets: ''
        });
    },


    toggle: function(event) {
        this.ui.ets.toggle();
        this.ui.ets.find('input').val(null);
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

        if (Modernizr.inputtypes.datetime === false) {
            $('input[type=datetime]').datetimepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'mm/dd/yy',
                timeFormat: 'hh:mm'
            });
        }
    }
});