Application.View.Suggestions = Backbone.Marionette.CompositeView.extend({
    template: {
        type: 'handlebars',
        template: JST['suggestions']
    },
    className: 'layout-container',

    itemViewContainer: '.collection-children',

    itemView: Application.View.Suggestion,
    emptyView: Application.View.SuggestionEmpty,

    ui: {
        'form': '.suggestions-form',
        'location': '.suggestions-location'
    },

    events: {
        'click .update': 'update'
    },

    modelEvents: {
        'change:location': 'load'
    },


    initialize: function() {
        $(window).on('resize', _.bind(this.resize, this));


        var self = this;

        var location = Application.session.location();

        location.done(function(data){
            var location  = data.countryname + ' ';
                location += data.region + ' ';
                location += data.city;

            location = location.replace(/^\s+|\s+$/g, '');

            if (location !== '') {
                self.model.set({
                    location: location
                });
            }
        });
    },


    resize: function() {
        // TODO: Determine calculcate
        this.$el.find('.scroller').height(
            $(window).height()
        );
    },


    update: function() {
        this.model.set('location', this.ui.location.val());

        return false;
    },


    load: function() {
        console.log('load');
        var self    = this;
        var promise = this.collection.fetch({
            data: {
                loc: self.model.get('location')
            }
        });

        promise.always(function(){
            self.model.set('loading', false);
        });
    },



    showEmptyView: function(){
        var EmptyView = Marionette.getOption(this, 'emptyView');

        if (EmptyView && !this._showingEmptyView){
            this._showingEmptyView = true;
            this.addItemView(this.model, EmptyView, 0);
        }
    }
});