Application.View.PublicTimelineHeader = Application.View.TimelineHeader.extend({
    template: {
        type: 'handlebars',
        template: JST['timeline-public-header']
    },
    className: 'timeline-header-public',

    events: {
        'click .now': 'refresh',
        'change .type': 'change',
        'submit .form': 'submit'
    },

    modelEvents: {
        'change:view': 'updateType',
        'change:type': 'updateUI'
    },

    placeholders: {
        a: 'Search for music',
        e: 'Search for events',
        v: 'Search for video',
        p: 'Search profiles'
    },

    views: {
        timeline: 'v',
        followings: 'p',
        followers: 'p'
    },

    ui: {
        nav: '.timeline-nav',
        form: '.form',
        type: '.type',
        types: '.type option',
        search: '.search'
    },


    initialize: function() {
        var options = this.model.get('options');

        if (options.type !== undefined && options.search !== undefined) {
            this.model.set({
                type: options.type,
                search: options.search,
                placeholder: this.placeholders[options.type]
            });
        } else {
            this.model.set({
                type: 'v',
                search: '',
                placeholder: this.placeholders['v']
            });
        }
    },


    refresh: function() {
        this.trigger('refresh');

        return false;
    },


    updateUI: function(event) {
        var view = this.model.get('view'),
            type = this.model.get('type');


        // Update navigation
        var $nav = this.ui.nav.find('.' + view);

        $nav.siblings().removeClass('active');
        $nav.addClass('active');


        // Update select
        var $option = this.ui.types.filter('[value='+type+']');

        $option.siblings().removeAttr('selected');
        $option.attr('selected', 'selected');

        // Update placeholder
        this.ui.search.attr('placeholder', this.placeholders[type]);
    },


    updateType: function() {
        this.model.set('type', this.views[this.model.get('view')]);
    },


    change: function(event) {
        var type = this.ui.type.val();

        // Update placeholder
        this.ui.search.attr('placeholder', this.placeholders[type]);

        // Trigger filter
        if (this.model.get('view') === 'search') {
            this.submit(event);
        }
    },


    submit: function(event) {
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