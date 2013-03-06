var StaticView = Backbone.View.extend({
    initialize: function (options) {
        this.template = _.template($("#" + options.name + "-tmpl").html());
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});