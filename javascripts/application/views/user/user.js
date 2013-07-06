Application.View.User = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['user']
    },


    className: 'user layout-container',


    events: {
        'submit form': 'submit',
        'click .destroy': 'destroy',
        'click .service': 'optOut',
        'click .cancel': 'cancel'
    },


    modelEvents: {
        'change': 'render'
    },



    optOut: function(event) {
        var $target = $(event.target);

        var checked = $target.prop('checked');
        if (checked === true) {
            // TODO
        } else {
            // TODO
        }
    },


    submit: function(event) {
        var data = $(event.target).serializeObject();


        var promise = this.model.set(data).save();

        promise.done(function(){
            Backbone.history.navigate('timeline', true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });

        return false;
    },


    destroy: function() {
        if (confirm("Are you sure you want to delete your profile?") === false) {
            return;
        }

        promise = this.model.destroy();

        promise.done(function(){
            Backbone.history.navigate('login', true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });

        return false;
    },


    cancel: function() {
        Backbone.history.navigate('timeline', true);

        return false;
    },


    onShow: function() {
        this.model.fetch();
    }
});