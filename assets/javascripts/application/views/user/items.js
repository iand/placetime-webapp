Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#items-template',
    className: 'items',

    events: {
        'click .promote': 'promote',
        'click .demote': 'demote'
    },

    itemView: Application.View.Item,
    itemViewContainer: '.children',


    initialize: function (options) {
        // Initialize subviews
        Backbone.Subviews.add(this);

        // Initialize courier
        Backbone.Courier.add(this);


        // Bubble view events, passMessages didn't work
        this.on('collection:rendered', function(){
            this.spawn('collection:rendered');
        });

        this.on('composite:collection:rendered', function(){
            this.spawn('collection:rendered');
        });

        this.on('after:item:added', function(){
            this.spawn('item:added');
        });

        this.on('item:removed', function(){
            this.spawn('item:removed');
        });


        // Bubble certain collection events
        this.listenTo(this.collection, 'item:promoted', function(event) {
            this.spawn('item:promoted', event);
        });

        this.listenTo(this.collection, 'item:demoted', function(event) {
            this.spawn('item:demoted', event);
        });


        // Custom events
        this.on('item:added', function(event) {
            this.collection.add(event.data);
        });

        this.on('scroll', function(event) {
            this.subviews.needle.scroll(event);
        });

        this.on('infinite:load', this.loadMore);
        this.on('now', this.now);
    },



    subviewCreators : {
        needle: function() {
            return new Application.View.Needle();
        }
    },




    addItem: function(item) {
        this.collection.add(item);
    },


    promote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');

        var model = this.collection.get(
            $item.data('id')
        );
        model.promote();

        return false;
    },


    demote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');

        var model = this.collection.get(
            $item.data('id')
        );
        model.demote();

        return false;
    },


    now: function() {
        var self = this;

        var promise = this.collection.now();

        promise.done(function(model) {
            var $closest = self.$el.find('.item[data-id='+model.get('id')+']'),
                $needle  = self.$el.find('.needle');


            var position = $closest.position(),
                offset   = $needle.position();


            self.trigger('scroll:to', {
                left: -(position.left),
                top: -(position.top - offset.top),
                duration: 0
            });

            $closest.addClass('now');

            // TODO: Use template
            $needle.find('.date').html(
                '<span class="future pull-left">' +
                  '<i class="icon-arrow-up"></i> Future' +
                '</span>' +
                '<span class="now">Now</span>' +
                '<span class="past pull-right">' +
                  'Past <i class="icon-arrow-down"></i>' +
                '</span>'
            );
        });
    },





    loadMore: function(options){
        var self = this;

        var data = {
            pid: self.model.get('pid'),
            status: self.model.get('status')
        };

        if (options.before) {
            data.after = 0;
            data.before = 10;
            data.ts = self.collection.last().get('ts');
        } else if (options.after) {
            data.after = 10;
            data.before = 0;
            data.ts = self.collection.first().get('ts');
        } else {
            throw new Error('Invalid options provided');
        }

        self.collection.fetch({
            remove: false,
            data: data
        }).done(function(){
            self.trigger('infinite:loaded');
        }).fail(function(){
            self.trigger('infinite:failed');
        });
    },



    appendHtml: function(collectionView, itemView, index) {
        var itemViewContainer = this.getItemViewContainer(collectionView);

        if (itemViewContainer.children().size() <= index) {
            itemViewContainer.append(itemView.el);
        } else {
            itemViewContainer.children().eq(index).before(itemView.el);
        }
    },


    buildItemView: function(item, ItemViewType, itemViewOptions) {
        item.set('status', this.model.get('status'));

        return new Application.View.Item({
            model: item
        });
    }
});