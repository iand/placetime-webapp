Application.View.Login = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['login']
    },
    className: 'login container',

    events: {
        'click .login-login': 'login',
        'submit .login-form': 'submit'
    },

    ui: {
        form: '.login-form',
        error: '.form-error'
    },

    login: function() {
        this.ui.form.show();

        return;
    },


    submit: function(event) {
        var data = this.ui.form.serializeObject();


        var self    = this,
            promise = Application.session.set(data).save();

        self.ui.error.empty();

        promise.done(function(){
            Backbone.history.navigate('timeline', true);
        });

        promise.fail(function(xhr, status, error){
            if (status === 'error') {
                error = error.toLowerCase();
                switch (error) {
                    case 'unauthorized':
                        self.ui.error.text('The credentials provided are invalid');
                        break;
                }
            } else if (status === 'timeout') {
                self.ui.error.text('The server is experiencing heavy load');
            }
        });

        return false;
    }
});