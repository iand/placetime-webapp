Application.View.Header = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: JST['header']
    },
    className: 'navbar',

    events: {
        'click .navbar-brand': 'reload'
    },

    modelEvents: {
        'change:pid': 'render'
    },


    reload: function() {
        window.location.href = window.location.href.replace(window.location.hash, '');

        return false;
    }
});