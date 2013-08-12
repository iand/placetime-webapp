Application.View.Timelines = Backbone.Marionette.ItemView.extend({
    name: 'timelines',
    template: {
        type: 'handlebars',
        template: JST['timelines']
    },
    className: 'layout-container-wide timelines',
    
    initialize: function(options) {
        var that = this;
        this.initViews();

        enquire.register("screen and (max-width: 767px)", {
            match : function() {
                var publicTimeline = that.subviews.findByCustom('publicTimeline'),
                    privateTimeline = that.subviews.findByCustom('privateTimeline');

                if (typeof publicTimeline === "undefined") {
                    that.addPublicView();
                }

                that.removePrivateView();
                that.initEvents();
                that.render();
            },  
        });

        enquire.register("screen and (min-width: 768px)", {
            match : function() {
                var publicTimeline = that.subviews.findByCustom('publicTimeline'),
                    privateTimeline = that.subviews.findByCustom('privateTimeline');

                if (typeof publicTimeline === "undefined") {
                    that.addPublicView();
                }

                if (typeof privateTimeline === "undefined") {
                    that.addPrivateView();
                }

                that.initEvents();
                that.render();
            },  
        });


    },


    initViews: function() {
        this.subviews = new Backbone.ChildViewContainer();
    },



    addPublicView: function() {
        var exists = this.subviews.findByCustom('publicTimeline');

        var publicTimeline = new Application.View.TimelinePublic({
            model: new Backbone.Model({
                pid: this.options.public.pid,
                view: this.options.public.view,
                options: this.options.public.options || {},
                status: 'p' 
            })
        });

        this.subviews.add(publicTimeline, 'publicTimeline');
    },


    removePublicView: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline');
        if (typeof publicTimeline !== "undefined") {
            this.subviews.remove(publicTimeline);
        }
    },

    addPrivateView: function() {
        var privateTimeline = new Application.View.TimelinePrivate({
            model: new Backbone.Model({
                pid: this.options.private.pid,
                view: this.options.private.view,
                options: this.options.private.options || {},
                status: 'm'
            })
        });

        this.subviews.add(privateTimeline, 'privateTimeline');
    },

    removePrivateView: function() {
        var privateTimeline = this.subviews.findByCustom('privateTimeline');
        if (typeof privateTimeline !== "undefined") {
            this.subviews.remove(privateTimeline);
        }
    },

    initEvents: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        if (typeof publicTimeline !== "undefined" && typeof privateTimeline !== "undefined") {

            this.listenTo(publicTimeline, 'item:promoted', function(items) {
                privateTimeline.trigger('item:add', items[0]);
            });

            this.listenTo(publicTimeline, 'item:added', function(item) {
                privateTimeline.trigger('item:add', item);
            });

            this.listenTo(privateTimeline, 'item:created', function(event) {
                privateTimeline.trigger('item:add', event);
            });
        } else {
            this.stopListening(publicTimeline, 'item:promoted');
            this.stopListening(publicTimeline, 'item:added');
            this.stopListening(privateTimeline, 'item:created');
        }

        if (typeof publicTimeline !== "undefined") {
            // Public timeline
            this.on('public:followings', function(options) {
                publicTimeline.trigger('view:followings', options);
            });

            this.on('public:followers', function(options) {
                publicTimeline.trigger('view:followers', options);
            });

            this.on('public:timeline', function(options) {
                publicTimeline.trigger('view:timeline', options);
            });

            this.on('public:search', function(options) {
                publicTimeline.trigger('view:search', options);
            });
        } else {
            this.off('public:followings');
            this.off('public:followers');
            this.off('public:timeline');
            this.off('public:search');
        }

        if (typeof privateTimeline !== "undefined") {
            // Private timeline
            this.on('private:itemAdd', function(options) {
                privateTimeline.trigger('view:itemAdd', options);
            });

            this.on('private:timeline', function(options) {
                privateTimeline.trigger('view:timeline', options);
            });
        } else {
            this.off('private:itemAdd');
            this.off('private:timeline');

        }
    },


    onRender: function() {
        var publicTimeline = this.subviews.findByCustom('publicTimeline'),
            privateTimeline = this.subviews.findByCustom('privateTimeline');

        if (typeof publicTimeline !== "undefined") {
            this.$el.find('.timeline-public').replaceWith(publicTimeline.render().el);
        } else {
            this.$el.find('.timeline-public').replaceWith("");
        }

        if (typeof privateTimeline !== "undefined") {
            this.$el.find('.timeline-private').replaceWith(privateTimeline.render().el);
        } else {
            this.$el.find('.timeline-private').replaceWith("");
        }
    }
});