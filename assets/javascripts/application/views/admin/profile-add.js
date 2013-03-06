var AddProfileView = Backbone.View.extend({
    events: {
        "click .saveBtn": "save"
    },


    initialize: function (options) {
        this.template = _.template($("#addprofile-tmpl").html());
    },


    save: function () {
        var self = this;
        $.ajax({
            url: '/-taddprofile',
            type: 'post',
            data: {
                pid: $('#pid').val(),
                pname: $('#pname').val(),
                pwd: $('#pwd').val(),
                bio: $('#bio').val()
            },
            success: function (data) {
                Backbone.history.navigate("profile/" + $('#pid').val(), true);
            }
        });

        return false;
    },


    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});