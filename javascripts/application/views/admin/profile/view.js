Application.Admin.View.ProfileView = Backbone.Marionette.ItemView.extend({
    template: '#profile-tmpl',

    events: {
        'click .editBtn': 'edit',
        'click .feedBtn': 'addfeed'
    },


    edit: function () {
        Backbone.history.navigate('profile/' + this.model.get('pid') + '/feed/edit/', true);

        return false;
    },


    addfeed: function () {
        Backbone.history.navigate('profile/' + this.model.get('pid') + '/feed/new', true);

        return false;
    },


    onRender: function() {
        // TODO: Fix
        var view = new Application.Admin.View.BriefItemView({
            collection: this.model.get('items')
        });

        this.$el.find('.items').append(view.el);
    }
});