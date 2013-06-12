Application.View.Loading = Backbone.Marionette.ItemView.extend({
    template: '#loading-template',
    className: function(options) {
        var className = 'loading';

        if (this.options.before) {
            className += ' loading-before';
        } else if (this.options.after) {
            className += ' loading-after';
        } else {
            throw new Error('Invalid options provided');
        }

        return className;
    }
});