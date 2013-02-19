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



        itemsElem   = $("#items", this.el);
        myitemsElem = $("#myitems", this.el);

        itemsElem.html('');
        myitemsElem.html('');


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
        var $wrapper = $(this.wrapper);
        var $items = $(this.scroller).children();

        if ($items.length === 0) {
            return;
        }


        // Code de-dup call this.closest
        var $closest = $items.first();
        $items.each(function(){
            var $this = $(this);

            if (Math.abs($this.data('model').diff) < Math.abs($closest.data('model').diff)) {
                $closest = $this;
            }
        });


        var position = $closest.position(),
            offset   = 0;

        if (this.wrapper.id === 'myitemslist') {
            offset = $wrapper.height() - 175;
        } else {
            offset = 175;
        }

        // Scroll to
        this.scrollTo(0, -(position.top - offset));
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


        $now.stop(true).fadeTo(0, 1).fadeTo(3000, 0);
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
Application.View.LoginView = Backbone.View.extend({
    events: {
        "change": "change",
        "click .loginBtn": "beforeLogin"
    },


    initialize: function (options) {
        this.template = _.template(window.templates['login']);
        this.render();
    },


    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },


    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);


        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            addValidationError(target.id, check.message);
        } else {
            removeValidationError(target.id);
        }
    },


    beforeLogin: function () {
        var check = this.model.validateAll();
        if (check.isValid === false) {
            displayValidationErrors(check.messages);
            return false;
        } else {
            this.login();
        }
        return false;
    },


    login: function () {
        var self = this;
        $.ajax({
            url: "/-session",
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                pwd: this.model.get('pwd')
            },
            success: function (data) {
                console.log("Logged in successfully");
                console.log("doing navigate");
                session.set("pid", self.model.get('pid'));
                Backbone.history.navigate("tl", true);
                console.log("stopped navigate");
            },
            error: function (model, response, options) {
                session.set("pid", null);
                console.log("Error thrown when logging in: " + response.responseText);
            }
        });
    }
});
Application.View.RegisterView = Backbone.View.extend({
    el: "#register",

    events: {
        "change": "change",
        "click .submitBtn": "beforeSubmit"
    },


    initialize: function (options) {
        this.template = _.template(window.templates['register']);
        this.render();
    },


    render: function () {
        $(this.el).html(this.template(this.model.toJSON())).trigger('create');
        return this;
    },


    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            addValidationError(target.id, check.message);
        } else {
            removeValidationError(target.id);
        }
    },


    beforeSubmit: function () {
        var check = this.model.validateAll();
        if (check.isValid === false) {
            displayValidationErrors(check.messages);
            return false;
        } else {
            this.submit();
        }
        return false;
    },


    submit: function () {
        $.ajax({
            url: "/-taddprofile",
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                pwd: this.model.get('pwd'),
                name: this.model.get('name')
            },
            success: function (data) {
                console.log("Created profile successfully");
                Backbone.history.navigate("", true);
            },
            error: function (model, response, options) {
                console.log("Error thrown when creating profile: " + response.responseText);
            }
        });
    }
});