Application.Model.Register = Backbone.Model.extend({
    defaults: {
        pid: null,
        pwd: null,
        name: null,
        email: null
    },


    url: '/-taddprofile',


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
        this.validators.name = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your full name."
            };
        };
        this.validators.email = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your email address."
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
    },


    save: function() {
        var promise = $.ajax({
            url: this.url,
            type: 'post',
            data: {
                pid: this.get('pid'),
                pwd: this.get('pwd'),
                name: this.get('name'),
                email: this.get('email')
            }
        });

        return promise;
    },
});