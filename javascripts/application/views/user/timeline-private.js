Application.View.TimelinePrivate = Application.View.Timeline.extend({
    name: 'timeline-private',

    className: 'column private',
    events: {
        'click .header .timeline': 'timeline',
        'click .header .now': 'refresh',
        'submit .header .form': 'add'
    },



    initialize: function(options) {
        this.initialEvents();

        // Handle
        this.on('view:itemAdd', function(){
            this.itemAdd();
        });
    },



    timeline: function() {
        var collection = new Application.Collection.Items(undefined, {
            status: this.model.get('status')
        });

        var model = new Backbone.Model({
            pid: this.model.get('pid'),
            status: this.model.get('status')
        });

        var view = new Application.View.Items({
            collection: collection,
            model: model
        });

        this.bindEvents(view);

        this.listenTo(view, 'item:demoted', function(event) {
            this.trigger('item:demoted', event);
        });

        this.region.show(view);
    },



    itemAdd: function() {
        var view = new Application.View.ItemAdd({
            collection: this.collection,
            model: this.model
        });

        this.bindEvents(view);

        this.listenTo(view, 'created', function() {
            this.timeline();
        });

        this.listenTo(view, 'cancelled', function() {
            this.timeline();
        });

        this.region.show(view);
    },


    add: function(event) {
        var $form = $(event.target);

        this.itemAdd();
        this.region.currentView.trigger('set:link', $form.find('input').val());

        return false;
    },


    onRender: function() {
        this.constructor.__super__.onRender.call(this, arguments);


        this.timeline();
    }
});