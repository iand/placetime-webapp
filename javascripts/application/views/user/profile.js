Application.View.Profile = Backbone.Marionette.ItemView.extend({
    template: '#profile-template',
    className: 'profile container',

    events: {
        'submit form': 'submit',
        'click .cancel': 'cancel'
    },


    modelEvents: {
        'change': 'render'
    },



    submit: function() {
        var data = $(event.target).serializeObject();


        var self    = this,
            promise = this.model.set(data).save();

        promise.done(function(){
            Backbone.history.navigate('timeline', true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });

        return false;
    },


    cancel: function() {
        Backbone.history.navigate('timeline', true);

        return false;
    },

    onShow: function() {
        this.model.fetch();
    }
});