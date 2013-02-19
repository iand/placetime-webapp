var Application = {
    Model: {},
    View: {},
    Collection: {},
    Router: {}
};
function hashCode(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}


function getCookie(c_name) {

  var i, x, y, ARRcookies = document.cookie.split(";");

  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g,"");
    if (x === c_name) {
      return unescape(y);
    }
  }
}

function setCookie(c_name, value) {
  var exdate = new Date();
  exdate.setHours(exdate.getHours() + 1);
  var c_value = escape(value) + "; expires=" + exdate.toUTCString();
  document.cookie=c_name + "=" + c_value;
}


function displayValidationErrors (messages) {
    for (var key in messages) {
        if (messages.hasOwnProperty(key)) {
            console.log(messages[key]);
            addValidationError(key, messages[key]);
        }
    }
}

function addValidationError(field, message) {
    var controlGroup = $('#' + field).parent();
    controlGroup.addClass('error');
    $('.hint', controlGroup).html(message);
}

function removeValidationError(field) {
    var controlGroup = $('#' + field).parent();
    controlGroup.removeClass('error');
    $('.hint', controlGroup).html('');
}
Application.Model.Credentials = Backbone.Model.extend({
    defaults: {
        pid: null,
        pwd: null
    },


    url: "/-session",


    initialize: function () {
        this.validators = {};
        this.validators.pid = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your username."
            };
        };
        this.validators.pwd = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your password."
            };
        };
    },


    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {
            isValid: true
        };
    },


    validateAll: function () {
        var messages = {};
        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }
        return _.size(messages) > 0 ? {
            isValid: false,
            messages: messages
        } : {
            isValid: true
        };
    }
});
Application.Model.Item = Backbone.Model.extend({idAttribute: "id"});
Application.Model.RegistrationInfo = Backbone.Model.extend({
    defaults: {
        pid: null,
        pwd: null,
        name: null
    },


    url: "/-session",


    initialize: function () {
        this.validators = {};
        this.validators.pid = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your username."
            };
        };
        this.validators.pwd = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your password."
            };
        };
        this.validators.name = function (value) {
            return (value !== null && value.length !== 0) ? {
                isValid: true
            } : {
                isValid: false,
                message: "Please enter your full name."
            };
        };
    },


    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {
            isValid: true
        };
    },


    validateAll: function () {
        var messages = {};
        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }
        return _.size(messages) > 0 ? {
            isValid: false,
            messages: messages
        } : {
            isValid: true
        };
    }
});
Application.Model.Session = Backbone.Model.extend({
    check: function (successfn, failfn) {
        var self = this;
        self.set("ptsession", getCookie("ptsession"));
        pts = self.get("ptsession");
        if (pts) {
            $.ajax({
                url: "/-chksession",
                dataType: "json",
                success: function (data) {
                    self.set("pid", self.get("ptsession").split("|")[0]);

                    console.log("Valid session for pid: " + self.get("pid"));

                    successfn();

                },
                error: function (data) {
                    self.set("pid", null);
                    failfn(self);
                }
            });
        } else {
            failfn();
        }
    }
});
Application.Collection.ItemList = Backbone.Collection.extend({
    model: Application.Model.Item,


    refresh: function () {
        var url = '/-jtl?count=40&pid=' + this.pid + '&status=' + this.status + '&order=' + this.order;
        var self = this;
        $.ajax({
            url: url,
            dataType: "json",
            success: function (data) {
                console.log("refresh retrieved " + data.length + " items");
                _.each(data, function (item) {
                    var dt = moment(item.ms);
                    item.year = dt.year();
                    item.month = dt.month();
                    item.day = dt.date();
                    item.hours = dt.hours();
                    item.minutes = dt.minutes();
                    item.seconds = dt.seconds();
                    item.fromnow = dt.fromNow();
                    item.diff = moment().diff(dt);

                });
                console.log("resetting");
                self.reset(data);
            }
        });
    }
});
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
Application.Router.App = Backbone.Router.extend({
    routes: {
        "login": "login",
        "register": "register",
        "*default": "timeline"
    },


    initialize: function () {
        session.set("ptsession", getCookie("ptsession"));
    },


    timeline: function () {
        var self = this;
        session.check(function () {
            var items = new Application.Collection.ItemList();
            items.order = "ets";
            items.pid = session.get("pid");
            items.status = 'p';
            items.refresh();

            var myItems = new Application.Collection.ItemList();
            myItems.order = items.order;
            myItems.pid = items.pid;
            myItems.status = 'm';
            myItems.refresh();



            self.changePage(new Application.View.ItemsView({
                el: $('#content'),
                itemsModel: items,
                myitemsModel: myItems,
                pid: session.get("pid")
            }));

        },

        function () {
            self.login();
        });
    },


    login: function () {
        console.log("Routed to login");
        var self = this;
        session.set("ptsession", null);
        setCookie('ptsession', null);
        this.changePage(new Application.View.LoginView({
            el: $('#content'),
            model: new Application.Model.Credentials()
        }), 'login');
    },


    register: function () {
        console.log("Routed to register");
        var self = this;
        session.set("ptsession", null);
        setCookie('ptsession', null);
        this.changePage(new Application.View.RegisterView({
            el: $('#content'),
            model: new Application.Model.RegistrationInfo()
        }));
    },


    logout: function () {
        this.login();
    },


    changePage: function (view, route) {
        console.log("Changing view to " + $(view.el).attr('id'));
        view.render();
        if (view.postRender) {
            view.postRender();
        }

        if (route) {
            console.log("Changing route to " + route);
            Backbone.history.navigate(route, true);
        }
    }
});
var session = new Application.Model.Session();
var approute = new Application.Router.App();

Backbone.history.start();