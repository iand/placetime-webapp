var FollowingListView = Backbone.View.extend({
    initialize: function (options) {
        var self = this;
        this.template = _.template($("#following-tmpl").html());

        this._views = [];

        this.collection.each(function (m) {
            self._views.push(new BriefProfileView({
                model: m
            }));
        });
    },


    render: function () {
        var self = this;
        $(this.el).html(this.template({
            data: {
                'pid': this.collection.pid
            }
        }));
        // Render each sub-view and append it to the parent view's element.
        _(this._views).each(function (v) {
            $(self.el).append(v.render().el);
        });
        return this;
    }
});