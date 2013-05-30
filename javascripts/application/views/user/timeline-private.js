Application.View.TimelinePrivate = Application.View.Timeline.extend({
    name: 'timeline-private',
    className: 'layout-column private',



    initialize: function(options) {
        this.initialEvents();

        // Handle
        this.on('view:itemAdd', function(){
            this.itemAdd();
        });
    },



    timeline: function(options) {
        var collection = new Application.Collection.Items(undefined, {
            status: this.model.get('status')
        });

        var model = new Backbone.Model({
            loading: true,
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

        this.regionManager.get('collection').show(view);
    },



    itemAdd: function(options) {
        var view = new Application.View.ItemAdd({
            collection : this.collection
        });

        view.model.set(options);


        this.bindEvents(view);

        this.listenTo(view, 'created', function() {
            this.timeline();
        });

        this.listenTo(view, 'cancelled', function() {
            this.timeline();
        });

        this.regionManager.get('collection').show(view);
    },



    onRender: function() {
        this.constructor.__super__.onRender.call(this, arguments);

        // Create header
        var header = new Application.View.PrivateTimelineHeader({
            model: this.model
        });

        this.listenTo(header, 'refresh', this.refresh);
        this.listenTo(header, 'view:itemAdd', this.itemAdd);
        this.listenTo(header, 'view:playlist', this.timeline);

        // Show header
        this.regionManager.get('header').show(header);
    }
});