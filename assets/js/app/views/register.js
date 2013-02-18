Application.View.RegisterView = Backbone.View.extend({
    el: "#register",

    events: {
        "change": "change",
        "click .submitBtn": "beforeSubmit"
    },


    initialize: function (options) {
        this.template = _.template(window.templates['register']);
        this.render();
    },


    render: function () {
        $(this.el).html(this.template(this.model.toJSON())).trigger('create');
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


    beforeSubmit: function () {
        var check = this.model.validateAll();
        if (check.isValid === false) {
            displayValidationErrors(check.messages);
            return false;
        } else {
            this.submit();
        }
        return false;
    },


    submit: function () {
        $.ajax({
            url: "/-taddprofile",
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                pwd: this.model.get('pwd'),
                name: this.model.get('name')
            },
            success: function (data) {
                console.log("Created profile successfully");
                Backbone.history.navigate("", true);
            },
            error: function (model, response, options) {
                console.log("Error thrown when creating profile: " + response.responseText);
            }
        });
    }
});