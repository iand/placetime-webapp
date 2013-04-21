var EditFeedView = Backbone.View.extend({
    events: {
        "click .saveBtn": "save"
    },


    initialize: function (options) {
        this.template = _.template($("#editfeed-tmpl").html());
    },


    save: function () {
        var self = this;
        $.ajax({
            url: '/-tupdateprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                pname: $('#pname').val(),
                parentpid: $('#parentpid').val(),
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
    }
});