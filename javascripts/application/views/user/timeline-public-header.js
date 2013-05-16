Application.View.PublicTimelineHeader = Application.View.TimelineHeader.extend({
    template: '#timeline-public-header-template',

    events: {
        'click .now': 'refresh',
        'submit .form': 'submit'
    },


    refresh: function() {
        this.trigger('refresh');

        return false;
    },


    submit: function(event) {
        var url = 'search/' + $(event.target).find('[type=search]').val();

        Backbone.history.navigate(url, true);

        return false;
    },
});