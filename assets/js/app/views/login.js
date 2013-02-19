Application.View.LoginView = Backbone.View.extend({
    events: {
        "change": "change",
        "click .loginBtn": "beforeLogin"
    },


    initialize: function (options) {
        this.template = _.template(window.templates['login']);
        this.render();
    },


    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },


    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);


        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            addValidationError(target.id, check.message);
        } else {
            removeValidationError(target.id);
        }
    },


    beforeLogin: function () {
        var check = this.model.validateAll();
        if (check.isValid === false) {
            displayValidationErrors(check.messages);
            return false;
        } else {
            this.login();
        }
        return false;
    },


    login: function () {
        var self = this;
        $.ajax({
            url: "/-session",
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                pwd: this.model.get('pwd')
            },
            success: function (data) {
                console.log("Logged in successfully");
                console.log("doing navigate");
                session.set("pid", self.model.get('pid'));
                Backbone.history.navigate("tl", true);
                console.log("stopped navigate");
            },
            error: function (model, response, options) {
                session.set("pid", null);
                console.log("Error thrown when logging in: " + response.responseText);
            }
        });
    }
});