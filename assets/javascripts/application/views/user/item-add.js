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
        this.model = new Application.Model.Item();
    },


    change: function (event) {
        this.model.set(event.target.name, event.target.value);
    },



    submit: function() {
        var promise = this.model.save();

        promise.done(function(){
            console.log('created!');
        });

        promise.fail(function(){
            console.log('not created!');
        });

        return false;
    }
});