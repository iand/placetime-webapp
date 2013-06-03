Application.View.PrivateTimelineHeader = Application.View.TimelineHeader.extend({
    template: '#timeline-private-header-template',

    events: {
        'click .playlist': 'playlist',
        'click .now': 'refresh',

        'click .watch'  : 'itemAdd',
        'click .listen' : 'itemAdd',
        'click .do'     : 'itemAdd'
    },


    modelEvents: {
        'change': 'render'
    },


    playlist: function() {
        this.trigger('view:playlist');

        return false;
    },


    refresh: function() {
        this.trigger('refresh');

        return false;
    },


    itemAdd: function(event) {
        var $input = $(event.target);

        this.trigger('view:itemAdd', {
            type: $input.val().toLowerCase()
        });

        return false;
    }
});