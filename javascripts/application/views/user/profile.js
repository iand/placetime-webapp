Application.View.Profile = Backbone.Marionette.ItemView.extend({
    template: '#profile-template',
    className: 'profile container',

    events: {
        'submit form': 'submit',
        'click .cancel': 'cancel'
    },



    submit: function() {
        var data = $(event.target).serializeObject();


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

    onShow: function() {
        this.model.fetch();
    }
});