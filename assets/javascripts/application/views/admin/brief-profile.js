var BriefProfileView = Backbone.View.extend({
    initialize: function (options) {
        this.template = _.template($("#briefprofile-tmpl").html());
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    }
});