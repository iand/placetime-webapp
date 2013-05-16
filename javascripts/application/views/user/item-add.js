Application.View.ItemAdd = Backbone.Marionette.ItemView.extend({
    template: '#item-add-template',
    className: 'item add',

    events: {
        'submit form': 'submit',
        'click .cancel': 'cancel'
    },

    modelEvents: {
        'change': 'render'
    },

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



    submit: function(event) {
        var data = $(event.target).serializeObject();


        var promise = this.model.set(data).save();

        promise.done(function(){
            self.trigger('created');
        });

        promise.fail(function(){
           // TODO: Display errors
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