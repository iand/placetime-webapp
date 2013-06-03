Application.View.ItemAdd = Backbone.Marionette.ItemView.extend({
    template: '#item-add-template',
    className: 'item add',

    events: {
        'submit form': 'submit',
        'click .cancel': 'cancel'
    },

    modelEvents: {
        'change': 'render'
    },

    initialize: function(options) {
        this.model.set({
            link: '',
            text: '',
            ets: ''
        });
    },



    submit: function(event) {
        var data = $(event.target).serializeObject();

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
    }
});