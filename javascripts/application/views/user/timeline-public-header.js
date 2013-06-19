Application.View.PublicTimelineHeader = Application.View.TimelineHeader.extend({
    template: '#timeline-public-header-template',
    className: 'timeline-header-public',

    events: {
        'click .now': 'refresh',
        'change .type': 'change',
        'submit .form': 'submit'
    },


    modelEvents: {
        'change': 'render'
    },


    initialize: function() {
        var options = this.model.get('options');

        if (options.type !== undefined && options.search !== undefined) {
            this.model.set({
                type: options.type,
                search: options.search
            });
        } else {
            this.model.set({
                type: 'v',
                search: ''
            });
        }

        this.model.set('placeholders', {
            a: 'Search for music',
            e: 'Search for events',
            v: 'Search for video',
            p: 'Search profiles'
        });
    },


    refresh: function() {
        this.trigger('refresh');

        return false;
    },


    update: function(event) {
        var $form = $(event.target).closest('form');

        this.model.set({
            type: $form.find('[name=t]').val(),
            search: $form.find('[name=s]').val()
        });
    },


    change: function(event) {
        // Trigger filter
        if (this.model.get('view') === 'search') {
            this.submit(event);
        } else {
            this.update(event);
        }
    },


    submit: function(event) {
        this.update(event);


        var $form = $(event.target).closest('form');

        var url = 'search/';

        // Type
        url += encodeURIComponent(
            $form.find('[name=t]').val()
        );

        url += '/';

        // Search
        url += encodeURIComponent(
            $form.find('[name=s]').val()
        );

        Backbone.history.navigate(url, true);

        return false;
    }
});