Application.View.Register = Backbone.Marionette.ItemView.extend({
    template: '#register-template',
    className: 'register container',

    events: {
        'submit form': 'submit'
    },



    submit: function() {
        var data = $(event.target).serializeObject();


        var self    = this,
            promise = this.model.set(data).save();

        promise.done(function(){
            Backbone.history.navigate('login', true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });

        return false;
    }
});