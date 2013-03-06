var BriefFeedView = Backbone.View.extend({
    initialize: function (options) {
        this.template = _.template($("#brieffeed-tmpl").html());
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    }
});