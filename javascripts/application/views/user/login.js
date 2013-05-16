Application.View.Login = Backbone.Marionette.ItemView.extend({
    template: '#login-template',
    className: 'login container',

    events: {
        'keyup input': 'change',
        'click .login': 'login',
        'submit form': 'submit'
    },


    login: function() {
        this.$el.find('.form').show();

        return;
    },


    change: function (event) {
        var target = event.target;


        this.model.set(target.name, target.value);


        var check = this.model.validateItem(target.id);

        if (check.isValid === false) {
            addValidationError(target.id, check.message);
        } else {
            removeValidationError(target.id);
        }
    },


    submit: function () {
        var check = this.model.validateAll();

        if (check.isValid === false) {
            displayValidationErrors(check.messages);
        } else {
            this.authenticate(this.model.attributes);
        }

        return false;
    },


    authenticate: function (data) {
        var self = this;

        Application.session.set('pid', data.pid);
        Application.session.set('pwd', data.pwd);

        Application.session.save(function (data) {
            Backbone.history.navigate('timeline', true);
        }, function () {});
    }
});