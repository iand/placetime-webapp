Application.View.ItemsView = Backbone.View.extend({
    events: {
        'click .promotebtn': 'promote',
        'click .demotebtn': 'demote',
        'click .followbtn': 'follow',
        'click #possiblebtn': 'possible',
        'click #maybebtn': 'maybe',
        'click #newbtn': 'newitem',
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
            vScroll: true
        });
        this.scroller2 = new iScroll('myitemslist', {
            momentum: true,
            hScrollbar: false,
            vScroll: true
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
        }, this);


        _.each(this.myitemsModel.models, function (item) {
            var data = item.toJSON();
                data.action = 'demote';

            if (this.myitemsModel.order == "ets") {
                myitemsElem.append(this.templatemycalitem(data));
            } else {
                myitemsElem.append(this.templatemyitem(data));
            }
        }, this);



        var itemClosest = this.closest(this.itemsModel.models),
            myitemClosest = this.closest(this.myitemsModel.models);

        _.defer(_.bind(function () {
            this.scroller1.refresh();
            this.scroller2.refresh();

            this.now(this.scroller1, itemClosest, 'top');
            this.now(this.scroller2, myitemClosest, 'bottom');
        }, self));

        return this;
    },


    now: function(scroller, item, relative) {
        if (scroller === undefined || item === undefined) {
            return;
        }

        // Get item
        var $item = $('#ti-' + item.attributes.id);

        // Get wrapper and remove existing now
        var $wrapper = $(scroller.wrapper);
            $wrapper.find('.now').remove();

        // Insert now
        var $now = $(this.templatenow());
            $now.insertBefore($item);


        var position = $item.position(),
            offset   = 0;

        if (relative === 'bottom') {
            offset = $wrapper.height() - $item.height();
        } else {
            offset = $item.height();
        }

        // Scroll to
        scroller.scrollTo(0, -(position.top - offset));
    },


    closest: function(items) {
        var closest = items[0];

        items.forEach(function(item) {
            if (Math.abs(item.attributes.diff) < Math.abs(closest.attributes.diff)) {
                closest = item;
            }
        });

        return closest;
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