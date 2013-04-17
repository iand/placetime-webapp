Application.Admin.View.Home = Backbone.Marionette.ItemView.extend({
    template: '#home-template',
    className: 'container',

    events: {
        'submit form': 'profile'
    },


    profile: function () {
        var url = 'profile/' + this.$el.find('input[name=pid]').val();

        Backbone.history.navigate(url, true);

        return false;
    }
});