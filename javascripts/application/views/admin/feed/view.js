Application.Admin.FeedView = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['feed-view']
    },

    events: {
        "click .editBtn": "edit",
        "click .refreshBtn": "refresh",
        "click .deleteBtn": "delete"
    },


    initialize: function (options) {
        this.initItemViews(options.items);
    },



    edit: function () {
        Backbone.history.navigate("editprofile/" + this.model.get('pid'), true);
        return false;
    },


    refresh: function () {
        var self = this;
        $.ajax({
            url: '/-refresh',
            type: 'get',
            data: {
                pid: self.model.get('pid')
            },
            success: function (data) {
                var items = new ProfileItems({
                    'pid': self.model.get('pid')
                });
                items.fetch({
                    success: function () {
                        self.initItemViews(items);
                        self.msg = "";
                        self.render();
                    },
                    error: function (request, status, error) {
                        self.msg = "There was a problem displaying feed items: " + request.responseText;
                        self.render();
                    }
                });

            },
            error: function (request, status, error) {
                self.msg = "There was a problem refreshing feed items: " + request.responseText;
                self.render();
            }
        });

        return false;
    },


    delete: function () {
        var self = this;
        $.ajax({
            url: '/-tremprofile',
            type: 'post',
            data: {
                pid: self.model.get('pid')
            },
            success: function () {
                Backbone.history.navigate("profile/" + self.model.get('parentpid'), true);
            },
            error: function (request, status, error) {
                self.msg = "There was a problem deleting the feed: " + request.responseText;
                self.render();
            }
        });

        return false;
    },


    initItemViews: function (items) {
        this._views = [];

        var self = this;
        items.each(function (m) {
            self._views.push(new BriefItemView({
                model: m
            }));
        });
    },


    render: function () {
        $(".msg", this.el).html(this.msg);

        var self = this;
        _(this._views).each(function (v) {
            $(".items", self.el).append(v.render().el);
        });
        return this;
    }
});