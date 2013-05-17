Application.Admin.View.ProfileEdit = Backbone.Marionette.ItemView.extend({
    template: '#editprofile-tmpl',

    events: {
        'click .saveBtn': 'save'
    },


    save: function (event) {
        var self = this;


        var data = $(event.target).serializeObject();

        var promise = $.ajax({
            url: '/-tupdateprofile',
            type: 'post',
            data: data
        });

        promise.done(function(){
            Backbone.history.navigate('profile/' + self.model.get('pid'), true);
        });

        promise.fail(function(){
            // TODO: Display errors
        });


        return false;
    }
});