Application.View.Followers = Backbone.Marionette.CompositeView.extend({
    template: {
        type: 'handlebars',
        template: JST['followers']
    },
    className: 'collection collection-followers',

    itemView: Application.View.Follower,
    itemViewContainer: '.collection-children',

    modelEvents: {
        'change:loading': 'render'
    },


    initialize: function (options) {
        this.on('infinite:load', this.load);
        this.on('infinite:load', this.loading);
        this.on('infinite:done', this.loaded);
        this.on('infinite:failed', this.loaded);
    },


    onShow: function() {
        var self    = this;
        var promise = this.collection.fetch({
            data: {
                pid: this.model.get('pid'),
                count: this.model.get('count')
            },
            remove: true
        });

        promise.always(function(){
            self.model.set('loading', false);
        });
    },


    onFollowed: function() {
        this.$el.addClass('followed');
    },


    onUnfollowed: function() {

    },


    load: function(options){
        if (options.before) {
            return;
        }


        var self = this;

        var data = {
            pid: self.model.get('pid'),
            start: self.model.get('start'),
            count: 10
        };

        self.collection.fetch({
            remove: false,
            data: data
        }).done(function(data){
            if (data.length > 0) {
                self.model.set('start', data.start + 10);
            }

            self.trigger('infinite:done', data);
        }).fail(function(){
            self.trigger('infinite:failed');
        });
    },


    loading: function(options) {
        this.loading = new Application.View.Loading(options);
        this.loading.render();

        this.$el.append(this.loading.$el);
    },


    loaded: function(options) {
        this.loading.remove();
    },


    showEmptyView: function(){
        var EmptyView = Marionette.getOption(this, 'emptyView');

        if (EmptyView && !this._showingEmptyView){
            this._showingEmptyView = true;
            this.addItemView(this.model, EmptyView, 0);
        }
    },


    buildItemView: function(item, ItemViewType, itemViewOptions) {
        var view = Backbone.Marionette.CompositeView.prototype.buildItemView.apply(this, arguments);

        view.model.set({
            user: this.model.get('pid'),
            session: Application.session.get('pid')
        }, {
            silent: true
        });

        return view;
    }
});