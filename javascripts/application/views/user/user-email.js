Application.View.UserEmail = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['user-email']
    },


    className: 'user layout-container',


    events: {
        'submit form': 'submit'
    },


    modelEvents: {
        'change': 'render'
    },


    submit: function() {
        var data = $(event.target).serializeObject();


        var self    = this,
            promise = this.model.set(data).save();

        promise.done(function(){
            $.cookie('ptnewuser', null);

            Backbone.history.navigate('timeline', true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });

        return false;
    },


    onShow: function() {
        this.model.fetch();
    }
});