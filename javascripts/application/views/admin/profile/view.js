Application.Admin.View.ProfileView = Backbone.Marionette.ItemView.extend({
    template: '#profile-view-template',
    className: 'layout-container',

    events: {
        'click .profile-edit': 'edit',
        'click .profile-add': 'add'
    },


    edit: function () {
        Backbone.history.navigate('profile/' + this.model.get('pid') + '/feed/edit/', true);

        return false;
    },


    add: function () {
        Backbone.history.navigate('profile/' + this.model.get('pid') + '/feed/new', true);

        return false;
    },



    // TODO: Insert dynamically to all pages
    onShow: function() {
        var view = new Application.Admin.View.Back();
            view.render();

        this.$el.prepend(view.el);
    },


    onRender: function() {
        // TODO: Fix
        var view = new Application.Admin.View.BriefItemView({
            collection: this.model.get('items')
        });

        this.$el.find('.profile-items').append(view.el);
    }
});