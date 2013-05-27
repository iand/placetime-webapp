Application.View.Header = Backbone.Marionette.ItemView.extend({
    template: '#header-template',
    className: 'navbar navbar-fixed',

    events: {
        'click .brand': 'reload'
    },

    modelEvents: {
        'change:pid': 'render'
    },

    reload: function() {
        window.location.href = window.location.href.replace(window.location.hash, '');

        return false;
    }
});