Application.View.PrivateTimelineHeader = Application.View.TimelineHeader.extend({
    template: '#timeline-private-header-template',

    events: {
        'click .playlist': 'playlist',
        'click .now': 'refresh',
        'submit .form': 'add'
    },


    playlist: function() {
        this.trigger('view:playlist');

        return false;
    },


    refresh: function() {
        this.trigger('refresh');

        return false;
    },


    add: function(event) {
        var $form = $(event.target);

        this.trigger('view:itemAdd', {
            link: $form.find('input').val()
        });

        return false;
    },
});