Application.Admin.View.ProfileEdit = Backbone.Marionette.ItemView.extend({
    template: '#profile-edit-template',
    className: 'layout-container',

    events: {
        'submit form': 'submit'
    },


    // TODO: Insert dynamically to all pages
    onShow: function() {
        var view = new Application.Admin.View.Back();
            view.render();

        this.$el.prepend(view.el);
    },


    submit: function (event) {
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