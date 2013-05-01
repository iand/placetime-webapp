Application.View.ItemAdd = Backbone.Marionette.ItemView.extend({
    template: '#item-add-template',
    className: 'item',

    events: {
        'submit form': 'submit',
        'click .cancel': 'cancel'
    },

    modelEvents: {
        'change': 'render'
    },

    // Do not use scroller
    noScroller: true,


    initialize: function(options) {
        this.model = new Application.Model.Item({
            link: '',
            text: '',
            ets: ''
        });

        this.on('set:link', function(value){
            this.model.set('link', value);
        });

        this.on('set:text', function(value){
            this.model.set('text', value);
        });

        this.on('set:ets', function(value){
            this.model.set('ets', value);
        });
    },



    submit: function() {
        var self = this;

        var data = {};
        $.each(this.$el.find('form').serializeArray(), function(index, field) {
            data[field.name] = field.value;
        });

        this.model.set(data);


        var promise = this.model.save();

        promise.done(function(){
            self.trigger('created');
        });

        promise.fail(function(){
            console.log('TODO: Display errors');
        });

        return false;
    },


    cancel: function() {
        this.trigger('cancelled');

        return false;
    },


    onShow: function() {
        this.delegateEvents();
    }
});