Application.View.Register = Backbone.Marionette.ItemView.extend({
    template: '#register-template',
    className: 'register container',

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
            this.register();
        }

        return false;
    },


    register: function () {
        var promise = this.model.save();

        promise.done(function(){
            Backbone.history.navigate('login', true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });
    }
});