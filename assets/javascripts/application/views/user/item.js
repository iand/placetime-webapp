Application.View.Item = Backbone.Marionette.ItemView.extend({
    template: '#item-template',
    className: 'item',

    time: function() {

    },

    attributes: function() {
        if (this.model === undefined) {
            return {};
        }

        return {
            'data-id': this.model.get('id'),
            'style': 'background-image: url(/-img/' + this.model.get('id') + '.jpg)'
        };
    },


    onBeforeRender: function() {
        this.$el.css({
            opacity: 0,
            maxHeight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginBottom: 0
        });
    },


    onRender: function() {
        this.$el.data('model', this.model);
        this.$el.animate({
            maxHeight: 140,
            opacity: 1,
            paddingTop: 15,
            paddingBottom: 15,
            marginBottom: 7
        }, 'slow', function(){
            $(this).css('max-height', 'auto');
        });
    },


    remove: function() {
        this.$el.animate({
            opacity: 0,
            maxHeight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginBottom: 0
        }, 'slow', function () {
            $(this).remove();
            $(this).css('max-height', 'auto');
        });

        this.stopListening();

        return this;
    }
});