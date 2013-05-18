Application.View.ProfileEmail = Application.View.Profile.extend({
    template: '#profile-email-template',



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
    }
});