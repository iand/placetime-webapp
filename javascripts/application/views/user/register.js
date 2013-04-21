Application.View.Register = Backbone.Marionette.ItemView.extend({
    template: '#register-template',
    className: 'container',

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
        // TODO: Use model
        $.ajax({
            url: '/-taddprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                pwd: this.model.get('pwd'),
                name: this.model.get('name')
            },
            success: function (data) {
                Backbone.history.navigate('login', true);
            },
            error: function (model, response, options) {
                console.log('TODO: Display errors');
            }
        });
    }
});