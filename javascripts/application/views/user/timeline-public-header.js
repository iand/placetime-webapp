Application.View.PublicTimelineHeader = Application.View.TimelineHeader.extend({
    template: '#timeline-public-header-template',

    events: {
        'click .now': 'refresh',
        'submit .form': 'submit'
    },


    modelEvents: {
        'change': function(model) {
            if (model.get('view') === 'search') {
                return;
            }

            this.render();
        }
    },


    refresh: function() {
        this.trigger('refresh');

        return false;
    },


    submit: function(event) {
        var url = 'search/';

        // Type
        url += encodeURIComponent(
            $(event.target).find('[name=t]').val()
        );

        url += '/';

        // Search
        url += encodeURIComponent(
            $(event.target).find('[name=s]').val()
        );


        Backbone.history.navigate(url, true);

        return false;
    }
});