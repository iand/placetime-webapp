Application.View.Login = Backbone.Marionette.ItemView.extend({
    template: '#login-template',
    className: 'login container',

    events: {
        'keyup input': 'change',
        'submit form': 'submit'
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
            this.login(this.model.attributes);
        }

        return false;
    },


    login: function (data) {
        var self = this;

        Application.session.set('pid', data.pid);
        Application.session.set('pwd', data.pwd);

        Application.session.save(function (data) {
            Backbone.history.navigate('timeline', true);
        }, function () {});
    }
});