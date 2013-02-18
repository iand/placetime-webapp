Application.Model.Credentials = Backbone.Model.extend({
    defaults: {
        pid: null,
        pwd: null
    },


    url: "/-session",


    initialize: function () {
        this.validators = {};
        this.validators.pid = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your username."
            };
        };
        this.validators.pwd = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your password."
            };
        };
    },


    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {
            isValid: true
        };
    },


    validateAll: function () {
        var messages = {};
        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }
        return _.size(messages) > 0 ? {
            isValid: false,
            messages: messages
        } : {
            isValid: true
        };
    }
});