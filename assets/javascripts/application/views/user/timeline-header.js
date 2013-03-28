Application.View.TimelineHeader = Backbone.Marionette.CompositeView.extend({
    template: '#timeline-header-template',

    events: {
        'click .nav .now': 'now',
        'click .nav .ets': 'event',
        'click .nav .ts': 'added'
    },


    now: function() {

    },


    event: function() {

    },


    added: function() {

    }
});