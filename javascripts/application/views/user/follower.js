Application.View.Follower = Backbone.Marionette.ItemView.extend({
    template: '#follower-template',
    className: 'item',

    attributes: function() {
        return {
            'data-pid': this.model.get('pid')
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