var AddFeedView = Backbone.View.extend({
    events: {
        "click .saveBtn": "save"
    },


    initialize: function (options) {
        this.template = _.template($("#addfeed-tmpl").html());
    },


    save: function () {
        var self = this;
        $.ajax({
            url: '/-taddprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid') + '~' + $('#feedpid').val(),
                pname: $('#pname').val(),
                parentpid: this.model.get('pid'),
                feedurl: $('#feedurl').val()
            },
            success: function (data) {
                Backbone.history.navigate("profile/" + self.model.get('pid'), true);
            }
        });
        return false;
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    },
});