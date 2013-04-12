    Application.View.NeedleNow = Backbone.Marionette.ItemView.extend({
    template: '#needle-now-template',

    initialize: function (options) {
        this.on('scroll', this.scroll);
    }
});