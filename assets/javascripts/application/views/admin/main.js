var MainView = Backbone.View.extend({
    events: {
        "click .profileBtn": "profile"
    },


    initialize: function (options) {
        this.template = _.template($("#main-tmpl").html());
        this.msg = options.msg;
    },


    profile: function () {
        Backbone.history.navigate("profile/" + $('#pid').val(), true);
        return false;
    },


    render: function () {
        $(this.el).html(this.template({
            data: {
                msg: this.msg
            }
        }));
        return this;
    }
});