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

        var view = this.model.get('view');
        if (view === 'search') {
            url += Backbone.history.fragment.match(/search\/([^/]+\/)/, '')[1];
        } else if (view === 'timeline') {
            url += 'items/';
        } else {
            url += 'profiles/';
        }

        url += $(event.target).find('[type=search]').val();


        Backbone.history.navigate(url, true);

        return false;
    },
});