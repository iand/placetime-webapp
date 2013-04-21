Application.View.Item = Backbone.Marionette.ItemView.extend({
    template: '#item-template',

    modelEvents: {
        'item:promoted': 'onPromoted'
    },


    attributes: function() {
        var attributes = {
            'data-id': this.model.id
        };

        if (this.model.get('image')) {
            attributes.style = 'background-image: url(/-img/' + this.model.get('image') + ')';
        }

        return attributes;
    },


    className: function() {
        var className = 'item';

        if (this.model.get('image')) {
            className += ' image';
        }

        if (this.model.get('event') == this.model.get('ts').toString().substr(0, 10)) {
            className += ' event';
        }

        return className;
    },


    onPromoted: function() {
        this.$el.removeClass('now').addClass('promoted');
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
            maxHeight: 150,
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