Application.View.User = Backbone.Marionette.ItemView.extend({
    template: '#user-template',
    className: 'user container',

    events: {
        'submit form': 'submit',
        'click .destroy': 'destroy',
        'click .cancel': 'cancel'
    },


    modelEvents: {
        'change': 'render'
    },



    submit: function() {
        var data = $(event.target).serializeObject();


        var promise = this.model.set(data).save();

        promise.done(function(){
            Backbone.history.navigate('timeline', true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });

        return false;
    },


    destroy: function() {
        if (confirm("Are you sure you want to delete your profile?") === false) {
            return;
        }

        promise = this.model.destroy();

        promise.done(function(){
            Backbone.history.navigate('login', true);
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