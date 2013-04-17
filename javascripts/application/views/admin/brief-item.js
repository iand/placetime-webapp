var BriefItemView = Backbone.View.extend({
    initialize: function (options) {
        this.template = _.template($("#briefitem-tmpl").html());
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    }
});