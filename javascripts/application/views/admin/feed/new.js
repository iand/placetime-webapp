Application.Admin.FeedNew = Backbone.Marionette.ItemView.extend({
    template: '#addfeed-tmpl',

    events: {
        'click .saveBtn': 'save'
    },


    save: function (event) {
        var self = this;


        var data = $(event.target).serializeObject();

        var promise = $.ajax({
            url: '/-taddprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid') + '~' + $('#feedpid').val(),
                name: $('#name').val(),
                parentpid: this.model.get('pid'),
                feedurl: $('#feedurl').val()
            }
        });

        promise.done(function(){
            Backbone.history.navigate("profile/" + self.model.get('pid'), true);
        });

        promise.fail(function(){
            // TODO: Implement
        });


        return false;
    }
});