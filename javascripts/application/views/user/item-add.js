Application.View.ItemAdd = Backbone.Marionette.ItemView.extend({
    template: '#item-add-template',
    className: 'item',

    events: {
        'keyup input': 'change',
        'submit form': 'submit'
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


    change: function (event) {
        this.model.set(event.target.name, event.target.value);
    },



    submit: function() {
        var self = this;


        var promise = this.model.save();

        promise.done(function(){
            self.trigger('item:created');
        });

        promise.fail(function(){
            console.log('TODO: Display errors');
        });

        return false;
    }
});