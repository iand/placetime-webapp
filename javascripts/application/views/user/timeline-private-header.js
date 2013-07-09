Application.View.PrivateTimelineHeader = Application.View.TimelineHeader.extend({
    template: {
        type: 'handlebars',
        template: JST['timeline-private-header']
    },
    className: 'timeline-header-private',

    events: {
        'click .playlist': 'playlist',
        'click .now': 'refresh',
        'submit .form': 'submit'
    },

    ui: {
        link: '.link'
    },


    initialize: function() {
        this.on('created', function(){
            this.ui.link.val(null);
        });
    },


    playlist: function() {
        this.trigger('view:playlist');

        return false;
    },


    refresh: function() {
        this.trigger('refresh');

        return false;
    },


    submit: function(event) {
        this.trigger('view:itemAdd', $(event.target).serializeObject());

        return false;
    }
});