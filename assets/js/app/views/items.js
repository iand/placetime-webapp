Application.View.ItemsView = Backbone.View.extend({
    events: {
        'click .promotebtn': 'promote',
        'click .demotebtn': 'demote',
        'click .followbtn': 'follow',
        'click #possiblebtn': 'possible',
        'click #maybebtn': 'maybe',
        'click #newbtn': 'newitem',

        'click #now': 'now',

        'click #ts': 'ts',
        'click #myts': 'myts',
        'click #ets': 'ets',
        'click #myets': 'myets'
    },


    initialize: function () {
        var self = this;
        this.template = _.template(window.templates['itemlist']);
        this.templatenow = _.template(window.templates['now']);
        this.templateitem = _.template(window.templates['otheritem']);
        this.templatemyitem = _.template(window.templates['myitem']);
        this.templatecalitem = _.template(window.templates['otheritemcal']);
        this.templatemycalitem = _.template(window.templates['myitemcal']);


        this.el = this.options.el;
        this.itemsModel = this.options.itemsModel;
        this.myitemsModel = this.options.myitemsModel;
        this.pid = this.options.pid;

        this.itemsModel.bind("reset", this.render, this);
        this.myitemsModel.bind("reset", this.render, this);
        this.scroller1 = null;
    },


    render: function (eventName) {
        if (this.scroller1) {
            this.scroller1.destroy();
        }

        if (this.scroller2) {
            this.scroller2.destroy();
        }

        $(this.el).html(this.template({
            data: {
                'pid': this.pid
            }
        }));


        this.scroller1 = new iScroll('itemslist', {
            momentum: true,
            hScrollbar: false,
            vScroll: true,
            onScrollEnd: this.scrollEnd,
            onRefresh: this.refresh
        });
        this.scroller2 = new iScroll('myitemslist', {
            momentum: true,
            hScrollbar: false,
            vScroll: true,
            onScrollEnd: this.scrollEnd,
            onRefresh: this.refresh
        });


        itemsElem   = $("#items", this.el).data('models', this.itemsModel);
        myitemsElem = $("#myitems", this.el).data('models', this.myitemsModel);

        itemsElem.html('');
        itemsElem.closest('div[class^=main-][class$=col]')
                   .removeClass('ts ets')
                   .addClass(this.itemsModel.order);

        myitemsElem.html('');
        myitemsElem.closest('div[class^=main-][class$=col]')
                     .removeClass('ts ets')
                     .addClass(this.myitemsModel.order);


        var self = this;

        _.each(this.itemsModel.models, function (item) {
            var data = item.toJSON();
                data.action = 'promote';

            if (this.itemsModel.order == "ets") {
                itemsElem.append(this.templatecalitem(data));
            } else {
                itemsElem.append(this.templateitem(data));
            }

            itemsElem.find('#ti-' + data.id).data('model', data);
        }, this);


        _.each(this.myitemsModel.models, function (item) {
            var data = item.toJSON();
                data.action = 'demote';

            if (this.myitemsModel.order == "ets") {
                myitemsElem.append(this.templatemycalitem(data));
            } else {
                myitemsElem.append(this.templatemyitem(data));
            }

            myitemsElem.find('#ti-' + data.id).data('model', data);
        }, this);


        _.defer(_.bind(function () {
            this.scroller1.refresh();
            this.scroller2.refresh();
        }, self));

        return this;
    },


    refresh: function() {
        var $wrapper  = $(this.wrapper);
        var $scroller = $(this.scroller);


        var $items = $scroller.children();

        if ($items.length === 0) {
            return;
        }


        // Events
        if ($scroller.data('models').order == 'ets') {
            // Code de-dup call this.closest
            var $closest = $items.first();
            $items.each(function(){
                var $this = $(this);

                // TODO: Rework
                if (Math.abs($this.data('model').diff) < Math.abs($closest.data('model').diff)) {
                    $closest = $this;
                }
            });
            // $closest = $items.eq(4);

            $closest.css('background-color', 'red');

            // Scroll to element
            this.scrollTo(0, -($wrapper.height() - 168));

            // if ($closest.position().top < $)
            console.log($closest.position().top);
            // $wrapper.parent().find('.now').css({
            //     top: $closest.position().top + 170 + 'px'
            // });
        }

        // Added
        else {
            this.scrollTo(0, 0);
        }
    },


    scrollEnd: function() {
        var $wrapper = $(this.wrapper).parent(),
            $now     = $(this.wrapper).parent().find('.now');

        var position = $now.offset();

        var $element = $(document.elementFromPoint(
            position.left,
            position.top + $now.height()
        ));

        if ($element.is('.timelinecalitem') === false) {
            return;
        }

        $now.find('span').text(
            moment($element.data('model').ets).format('DD MMM YYYY')
        );


        // $now.stop(true).fadeTo(0, 1).fadeTo(3000, 0);
    },


    closest: function(items) {
        var closest = items[0];
        _.each(items, function(item){
            if (Math.abs(item.attributes.diff) < Math.abs(closest.attributes.diff)) {
                closest = item;
            }
        });

        return $('#ti-' + closest.attributes.id);

        // TODO: Support iterating over both DOM and models
        // var $closest = $items.first();
        // $items.each(function(){
        //     var $this = $(this);

        //     if (Math.abs($this.data('model').diff) < Math.abs($closest.data('model').diff)) {
        //         $closest = $this;
        //     }
        // });

        // return $closest;
    },


    now: function(event) {
        var $target = $(event.target);

        if ($target.closest('.main-alltimelineheader').length > 0) {
            $closest = this.closest(this.itemsModel.models);
            $wrapper = $('.main-alltimelinecol');

            scroller = this.scroller1;
            offset   = 175;
        } else {
            $closest = this.closest(this.myitemsModel.models);
            $wrapper = $('.main-mytimelinecol');

            scroller = this.scroller2;
            offset   = $wrapper.height() - 175;
        }

        var $now = $wrapper.find('.now');

        $now.stop(true).fadeTo(0, 1);
        $now.find('span').text('Now');

        // Scroll to
        scroller.scrollTo(0, -($closest.position().top - offset), 1000);
    },


    promote: function (e) {
        var clickedEl = $(e.currentTarget);
        var id = clickedEl.data("itemid");
        var itemEl = $('#ti-' + id);
        var self = this;
        self.itemsModel.remove(id);

        $.ajax({
            url: '/-tpromote',
            type: 'post',
            data: {
                pid: session.get("pid"),
                id: id
            },
            success: function (data) {
                itemEl.slideUp('slow').fadeOut('slow', function () {
                    self.itemsModel.refresh();
                    self.myitemsModel.refresh();
                    //self.render();
                });
            }
        });


        return false;
    },


    demote: function (e) {
        var clickedEl = $(e.currentTarget);
        var id = clickedEl.data("itemid");
        // alert("Promote item '" + id + "' to maybe list");
        var self = this;
        var itemEl = $('#ti-' + id);

        $.ajax({
            url: '/-tdemote',
            type: 'post',
            data: {
                pid: session.get("pid"),
                id: id
            },
            success: function (data) {
                itemEl.slideUp('slow').fadeOut('slow', function () {
                    self.itemsModel.refresh();
                    self.myitemsModel.refresh();
                });
            }
        });

        return false;
    },


    follow: function (e) {
        var clickedEl = $(e.currentTarget);
        var pid = clickedEl.data("pid");
        alert("Follow user '" + pid + "'");
    },


    possible: function (e) {
        //this.itemsModel.status = 'p';
        //this.itemsModel.refresh();
    },


    maybe: function (e) {
        //this.itemsModel.status = 'm';
        //this.itemsModel.refresh();
    },


    newitem: function (e) {
        //alert("Add a new item");
    },


    ts: function (e) {
        this.itemsModel.order = "ts";
        this.itemsModel.refresh();
    },


    ets: function (e) {
        this.itemsModel.order = "ets";
        this.itemsModel.refresh();
    },


    myts: function (e) {
        this.myitemsModel.order = "ts";
        this.myitemsModel.refresh();
    },


    myets: function (e) {
        this.myitemsModel.order = "ets";
        this.myitemsModel.refresh();
    }
});