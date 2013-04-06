Application.Admin.View.Home = Backbone.Marionette.ItemView.extend({
    template: '#home-template',

    events: {
        'click .profileBtn': 'profile'
    },


    // initialize: function (options) {
    //     this.template = _.template($('#main-tmpl').html());
    //     this.msg = options.msg;
    // },


    profile: function () {
        Backbone.history.navigate('profile/' + $('#pid').val(), true);
        return false;
    }


    // render: function () {
    //     $(this.el).html(this.template({
    //         data: {
    //             msg: this.msg
    //         }
    //     }));
    //     return this;
    // }
});