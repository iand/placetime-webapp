Application.View.Timeline = Backbone.Marionette.ItemView.extend({
    name: 'timeline',
    template: '#timeline-template',
    className: 'column',

    infiniteScrollReference: null,
    infiniteScrollLastUpdate: moment().subtract('seconds', 2),

    initialEvents: function() {
        $(window).on('resize', _.bind(this.resize, this));

        // Pass event to current view
        this.on('item:add', function(event) {
            this.regionManager.get('collection').currentView.trigger('item:add', event);
        });

        // Load timeline view
        this.on('view:timeline', function(pid){
            this.timeline(pid);
        });

        // On view change update model
        this.on('all', function(event) {
            var match = event.match(/view:(.*)/);

            if (match === null) {
                return;
            }

            this.model.set('view', match[1]);
        });

        this.on('scroll', this.infiniteScroll);
    },


    bindEvents: function(view) {
        if (view.collection) {
            this.listenToOnce(view.collection, 'sync', function(event){
                view.$el.find('.item').first().transitionEnd(_.bind(function(event){
                    if (event.propertyName !== 'max-height') {
                        return;
                    }

                    this.now();
                }, this));
            });
        }

        // On show resize the child
        this.listenTo(view, 'show', this.resize);

        // On render resize the child
        this.listenTo(view, 'render', this.resize);

        // On scroll trigger infinite scroll
        this.listenTo(view, 'scroll', this.infiniteScroll);

        // Handle scroll to requests
        this.listenTo(view, 'scrollTo', function(event) {
            var $scroller = this.$el.find('.scroller');

            // Already there
            if (event.top === $scroller.scrollTop()) {
                return;
            }

            view.trigger('scrollTo:start');

            $scroller.animate({
                scrollTop: event.top,
                scrollLeft: event.left
            }, event.duration, function(){
                view.trigger('scrollTo:done');
            });
        });
    },


    resize: function() {
        this.$el.find('.scroller').height(
            $(window).height() - 60
        );
    },


    reload: function() {
        this.regionManager.get('collection').currentView.trigger('reload', this);
    },


    now: function() {
        this.regionManager.get('collection').currentView.trigger('now', this);
    },


    refresh: function() {
        this.listenToOnce(this.regionManager.get('collection').currentView, 'reload:done', function(){
            this.regionManager.get('collection').currentView.$el.find('.item').first().transitionEnd(_.bind(function(){
                if (event.propertyName !== 'max-height') {
                    return;
                }

                this.now();
            }, this));
        });
        this.reload();
    },


    onRender: function() {
        this.regionManager = new Marionette.RegionManager();
        this.regionManager.addRegions({
            'header': {
                parentEl: this.$el,
                selector: '.header'
            },
            'collection': {
                parentEl: this.$el,
                selector: '.collection'
            }
        });

        // Load view
        this.trigger('view:' + this.model.get('view'));
    },


    infiniteScroll: function(event) {
        var deferred = _.bind(this.infiniteScrollDeferred, this, event);


        clearTimeout(this.infiniteScrollReference);

        this.infiniteScrollReference = setTimeout(deferred, 150);
    },


    infiniteScrollDeferred: function(event) {
        var $target = $(event.target);


        // Threshold, 10 before end
        var threshold = (140 * 20);

        // Current scrollTop, maxScrollTop
        var scrollTop = $target.scrollTop(),
            maxScrollTop = $target.find('.children').height();

        // Loading
        if (this.infiniteScrollLoading === true) {
            return;
        }

        else if (moment().diff(this.infiniteScrollLastUpdate) < 2000) {
            return;
        }

        // Top infinite scroll
        else if (Math.abs(scrollTop) < threshold) {
            this.infiniteScrollLastUpdate = moment();
            this.regionManager.get('collection').currentView.trigger('infinite:load', {after: true});
        }

        // Bottom infinite scroll
        else if (Math.abs(scrollTop) > Math.abs(maxScrollTop - threshold)) {
            this.infiniteScrollLastUpdate = moment();
            this.regionManager.get('collection').currentView.trigger('infinite:load', {before: true});
        }

        // Somewhere inbetween
        else {
            return;
        }
    }
});