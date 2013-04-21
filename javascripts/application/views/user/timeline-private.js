Application.View.TimelinePrivate = Application.View.Timeline.extend({
    events: {
        'click .header .items': 'timeline',
        'click .header .now': 'now',
        'submit .header .form': 'add'
    },



    initialize: function(options) {
        this.initSubviews();
        this.initEvents();
    },



    initSubviews: function() {
        // Setup subviews
        this.subviews = new Backbone.ChildViewContainer();

        this.initTimeline();
        this.initAddItem();
    },



    initTimeline: function() {
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

        this.subviews.add(view, 'timeline');
    },


    initAddItem: function() {
        var view = new Application.View.ItemAdd();

        this.listenTo(view, 'item:created', function(){
            this.render();
        });

        this.subviews.add(view, 'itemAdd');
    },


    initEvents: function() {
        this.constructor.__super__.initEvents.call(this, arguments);

        // Bubble promoted/demoted timeline events
        var view = this.subviews.findByCustom('timeline');

        this.listenTo(view, 'item:demoted', function(event) {
            this.trigger('item:demoted', event);
        });
    },



    now: function() {
        this.region.currentView.trigger('now', this);
    },



    add: function(event) {
        var $form = $(event.target);

        var view = this.subviews.findByCustom('itemAdd');
            view.trigger('set:link', $form.find('input').val());

        this.region.show(view);

        return false;
    },


    onRender: function() {
        this.constructor.__super__.onRender.call(this, arguments);


        // Initial view
        var view = this.subviews.findByCustom(
            this.model.get('view')
        );

        this.region.show(view);
    }
});