Application.View.Login = Backbone.Marionette.ItemView.extend({
    template: '#login-template',
    className: 'login container',

    events: {
        'click .login': 'login',
        'submit form': 'submit'
    },


    login: function() {
        this.$el.find('.form').show();

        return;
    },


    submit: function() {
        var data = $(event.target).serializeObject();


        var self    = this,
            promise = Application.session.set(data).save();

        promise.done(function(){
            Backbone.history.navigate('timeline', true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });

        return false;
    }
});