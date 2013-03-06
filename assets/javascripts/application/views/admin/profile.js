var ProfileView = Backbone.View.extend({
    events: {
        "click .editBtn": "edit",
        "click .feedBtn": "addfeed"
    },


    initialize: function (options) {
        this.template = _.template($("#profile-tmpl").html());

        this._views = [];

        var self = this;
        options.items.each(function (m) {
            self._views.push(new BriefItemView({
                model: m
            }));
        });
    },


    edit: function () {
        Backbone.history.navigate("editprofile/" + this.model.get('pid'), true);
        return false;
    },


    addfeed: function () {
        Backbone.history.navigate("addfeed/" + this.model.get('pid'), true);
        return false;
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        var self = this;
        _(this._views).each(function (v) {
            $(".items", self.el).append(v.render().el);
        });
        return this;
    }
});