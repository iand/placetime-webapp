Application.View.Suggestions = Backbone.Marionette.CompositeView.extend({
    template: '#suggestions-template',
    className: 'suggestions',

    itemViewContainer: '.children',

    itemView: Application.View.Suggestion,
    emptyView: Application.View.SuggestionEmpty,

    onShow: function() {
        var self    = this;
        var promise = this.collection.fetch({
            data: {
                loc: 'london'
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