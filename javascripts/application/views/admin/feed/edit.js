Application.Admin.FeedEdit = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['feed-edit']
    },
    events: {
        "click .saveBtn": "save"
    },


    save: function () {
        var self = this;
        $.ajax({
            url: '/-tupdateprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                name: $('#name').val(),
                parentpid: $('#parentpid').val(),
                feedurl: $('#feedurl').val()
            },
            success: function (data) {
                Backbone.history.navigate("profile/" + self.model.get('pid'), true);
            }
        });

        return false;
    }
});