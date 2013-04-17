Application.View.LoadMore = Backbone.Marionette.ItemView.extend({
    template: '#load-more-template',
    className: 'load-more',
    events: {
        'click': 'loadMore'
    },

    loadMore: function() {
        this.trigger('loadmore');
    }
});