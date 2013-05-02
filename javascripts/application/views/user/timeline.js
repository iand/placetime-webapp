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
            this.region.currentView.trigger('item:add', event);
        });

        // Load timeline view
        this.on('view:timeline', function(pid){
            this.timeline(pid);
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
        this.region.currentView.trigger('reload', this);
    },


    now: function() {
        this.region.currentView.trigger('now', this);
    },


    refresh: function() {
        this.listenToOnce(this.region.currentView, 'reload:done', function(){
            this.region.currentView.$el.find('.item').first().transitionEnd(_.bind(function(){
                if (event.propertyName !== 'max-height') {
                    return;
                }

                this.now();
            }, this));
        });
        this.reload();
    },


    onRender: function() {
        // Create region
        this.region = new Backbone.Marionette.Region({
              el: this.$el.find('.collection')
        });

        // Load view
        var view = this.model.get('view');
        if (view) {
            this[view]();
        } else {
            this.timeline();
        }
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
            this.region.currentView.trigger('infinite:load', {after: true});
        }

        // Bottom infinite scroll
        else if (Math.abs(scrollTop) > Math.abs(maxScrollTop - threshold)) {
            this.infiniteScrollLastUpdate = moment();
            this.region.currentView.trigger('infinite:load', {before: true});
        }

        // Somewhere inbetween
        else {
            return;
        }
    }
});