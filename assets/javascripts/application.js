var Application = new Backbone.Marionette.Application();

Application.Model = {};
Application.View = {};
Application.Collection = {};
Application.Router = {};


// Regions
Application.addRegions({
    header: '#header',
    content: '#content',
    footer: '#footer'
});


// TODO: Remove global variable
var session;
Application.addInitializer(function(options){
    session = new Application.Model.Session();
});


// TODO: Remove global variable
var router;
Application.addInitializer(function(options){
    if (options.router === 'admin') {
        router = new Application.Router.Admin();
    } else {
        router = new Application.Router.User();
    }
});


// TODO: Move
Application.addInitializer(function(){
    $(".fancymodal").fancybox({
        maxWidth    : 970,
        maxHeight    : 800,
        fitToView    : false,
        width        : '70%',
        height        : '70%',
        autoSize    : false,
        closeClick    : false,
        openEffect    : 'none',
        closeEffect    : 'none'
    });
});


// TODO: Remove global variable
var matched;
// Start history
Application.on('initialize:after', function(options){
    matched = Backbone.history.start({
        root: '/timeline/'
    });
});


// Start session and authorize
Application.on('initialize:after', function(options){
    session.check(function(){
        if (matched === true) {
            return;
        }

        router.navigate('timeline', {trigger: true});
    }, function(){
        // TODO: Don't redirect if login/register
        if (matched === true) {
            return;
        } else {
            router.navigate('login', {trigger: true});
        }
    });
});
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
var Feed = Backbone.Model.extend({

});
Application.Model.Item = Backbone.Model.extend({
    idAttribute: "id"
});

var Item = Backbone.Model.extend({

});
var Profile = Backbone.Model.extend({
    url: function() {
        return '/-jpr?pid=' + this.get('pid');
    }
});
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
                success: function (data) {
                    self.set("pid", self.get("ptsession").split("|")[0]);

                    console.log("Valid session for pid: " + self.get("pid"));

                    successfn(data);
                },
                error: function (data) {
                    self.set("pid", null);
                    failfn(data);
                }
            });
        } else {
            failfn();
        }
    },

    save: function (successfn, failfn) {
        var self = this;

        $.ajax({
            url: "/-session",
            type: 'post',
            data: {
                pid: self.get('pid'),
                pwd: self.get('pwd')
            },
            success: function (data) {
                console.log("Logged in successfully");
                self.set("pwd", null);

                successfn.call(self, data);
            },
            error: function (data) {
                console.log("Error thrown when logging in: " + response.responseText);
                self.set("pwd", null);

                failfn.call(self, data);
            }
        });
    }
});
var FeedsList = Backbone.Collection.extend({
    model: Feed,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jfeeds?pid=' + this.pid;
    }
});
var FollowersList = Backbone.Collection.extend({
    model: Profile,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jfollowers?count=40&pid=' + this.pid;
    }
});
var FollowingList = Backbone.Collection.extend({
    model: Profile,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jfollowing?count=40&pid=' + this.pid;
    }
});
Application.Collection.ItemList = Backbone.Collection.extend({
    model: Application.Model.Item,
    url: '/-jtl',

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
    },


    fetch: function(options) {
        var self = this;

        var promise = $.ajax({
            url: this.url + '?' + $.param(options.data),
            dataType: 'json'
        });

        promise.done(function(data){
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
        });

        return promise;
    }
});
var ProfileItems = Backbone.Collection.extend({
    model: Item,

    initialize: function (options) {
        this.pid = options.pid;
    },

    url: function () {
        return '/-jtl?status=m&count=30&pid=' + this.pid;
    }
});
var BriefFeedView = Backbone.View.extend({
    initialize: function (options) {
        this.template = _.template($("#brieffeed-tmpl").html());
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    }
});
var BriefItemView = Backbone.View.extend({
    initialize: function (options) {
        this.template = _.template($("#briefitem-tmpl").html());
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    }
});
var BriefProfileView = Backbone.View.extend({
    initialize: function (options) {
        this.template = _.template($("#briefprofile-tmpl").html());
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    }
});
var AddFeedView = Backbone.View.extend({
    events: {
        "click .saveBtn": "save"
    },


    initialize: function (options) {
        this.template = _.template($("#addfeed-tmpl").html());
    },


    save: function () {
        var self = this;
        $.ajax({
            url: '/-taddprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid') + '~' + $('#feedpid').val(),
                pname: $('#pname').val(),
                parentpid: this.model.get('pid'),
                feedurl: $('#feedurl').val()
            },
            success: function (data) {
                Backbone.history.navigate("profile/" + self.model.get('pid'), true);
            }
        });
        return false;
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    },
});
var EditFeedView = Backbone.View.extend({
    events: {
        "click .saveBtn": "save"
    },


    initialize: function (options) {
        this.template = _.template($("#editfeed-tmpl").html());
    },


    save: function () {
        console.log("saving feed: " + $('#pname').val());
        console.log("pid: " + this.model.get('pid'));
        console.log("pname: " + $('#pname').val());
        console.log("parentpid: " + $('#parentpid').val());
        console.log("feedurl: " + $('#feedurl').val());
        var self = this;
        $.ajax({
            url: '/-tupdateprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                pname: $('#pname').val(),
                parentpid: $('#parentpid').val(),
                feedurl: $('#feedurl').val()
            },
            success: function (data) {
                Backbone.history.navigate("profile/" + self.model.get('pid'), true);
            }
        });

        return false;
    },



    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    }
});
var FeedView = Backbone.View.extend({
    events: {
        "click .editBtn": "edit",
        "click .refreshBtn": "refresh",
        "click .deleteBtn": "delete"
    },


    initialize: function (options) {
        this.template = _.template($("#feed-tmpl").html());
        this.msg = "";
        this.initItemViews(options.items);
    },



    edit: function () {
        Backbone.history.navigate("editprofile/" + this.model.get('pid'), true);
        return false;
    },


    refresh: function () {
        var self = this;
        $.ajax({
            url: '/-refresh',
            type: 'get',
            data: {
                pid: self.model.get('pid')
            },
            success: function (data) {
                var items = new ProfileItems({
                    'pid': self.model.get('pid')
                });
                items.fetch({
                    success: function () {
                        self.initItemViews(items);
                        self.msg = "";
                        self.render();
                    },
                    error: function (request, status, error) {
                        self.msg = "There was a problem displaying feed items: " + request.responseText;
                        self.render();
                    }
                });

            },
            error: function (request, status, error) {
                self.msg = "There was a problem refreshing feed items: " + request.responseText;
                self.render();
            }
        });

        return false;
    },


    delete: function () {
        var self = this;
        $.ajax({
            url: '/-tremprofile',
            type: 'post',
            data: {
                pid: self.model.get('pid')
            },
            success: function () {
                Backbone.history.navigate("profile/" + self.model.get('parentpid'), true);
            },
            error: function (request, status, error) {
                self.msg = "There was a problem deleting the feed: " + request.responseText;
                self.render();
            }
        });

        return false;
    },


    initItemViews: function (items) {
        this._views = [];

        var self = this;
        items.each(function (m) {
            self._views.push(new BriefItemView({
                model: m
            }));
        });
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));

        $(".msg", this.el).html(this.msg);

        var self = this;
        _(this._views).each(function (v) {
            $(".items", self.el).append(v.render().el);
        });
        return this;
    }
});
var FeedsListView = Backbone.View.extend({
    initialize: function (options) {
        var self = this;
        this.template = _.template($("#feeds-tmpl").html());

        this._views = [];

        this.collection.each(function (m) {
            self._views.push(new BriefFeedView({
                model: m
            }));
        });
    },


    render: function () {
        var self = this;
        $(this.el).html(this.template({
            data: {
                'pid': this.collection.pid
            }
        }));
        // Render each sub-view and append it to the parent view's element.
        _(this._views).each(function (v) {
            $(self.el).append(v.render().el);
        });
        return this;
    }
});
var FollowersListView = Backbone.View.extend({
    initialize: function (options) {
        var self = this;
        this.template = _.template($("#followers-tmpl").html());

        this._views = [];

        this.collection.each(function (m) {
            self._views.push(new BriefProfileView({
                model: m
            }));
        });
    },


    render: function () {
        var self = this;
        $(this.el).html(this.template({
            data: {
                'pid': this.collection.pid
            }
        }));
        // Render each sub-view and append it to the parent view's element.
        _(this._views).each(function (v) {
            $(self.el).append(v.render().el);
        });
        return this;
    }
});
var FollowingListView = Backbone.View.extend({
    initialize: function (options) {
        var self = this;
        this.template = _.template($("#following-tmpl").html());

        this._views = [];

        this.collection.each(function (m) {
            self._views.push(new BriefProfileView({
                model: m
            }));
        });
    },


    render: function () {
        var self = this;
        $(this.el).html(this.template({
            data: {
                'pid': this.collection.pid
            }
        }));
        // Render each sub-view and append it to the parent view's element.
        _(this._views).each(function (v) {
            $(self.el).append(v.render().el);
        });
        return this;
    }
});
var MainView = Backbone.View.extend({
    events: {
        "click .profileBtn": "profile"
    },


    initialize: function (options) {
        this.template = _.template($("#main-tmpl").html());
        this.msg = options.msg;
    },


    profile: function () {
        Backbone.history.navigate("profile/" + $('#pid').val(), true);
        return false;
    },


    render: function () {
        $(this.el).html(this.template({
            data: {
                msg: this.msg
            }
        }));
        return this;
    }
});
var AddProfileView = Backbone.View.extend({
    events: {
        "click .saveBtn": "save"
    },


    initialize: function (options) {
        this.template = _.template($("#addprofile-tmpl").html());
    },


    save: function () {
        var self = this;
        $.ajax({
            url: '/-taddprofile',
            type: 'post',
            data: {
                pid: $('#pid').val(),
                pname: $('#pname').val(),
                pwd: $('#pwd').val(),
                bio: $('#bio').val()
            },
            success: function (data) {
                Backbone.history.navigate("profile/" + $('#pid').val(), true);
            }
        });

        return false;
    },


    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});
var EditProfileView = Backbone.View.extend({
    events: {
        "click .saveBtn": "save"
    },


    initialize: function (options) {
        this.template = _.template($("#editprofile-tmpl").html());
    },


    save: function () {
        var self = this;
        $.ajax({
            url: '/-tupdateprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                bio: $('#bio').val(),
                pname: $('#pname').val(),
                parentpid: $('#parentpid').val(),
                feedurl: $('#feedurl').val()
            },
            success: function (data) {
                Backbone.history.navigate("profile/" + self.model.get('pid'), true);
            }
        });

        console.log("save");
        return false;
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        return this;
    }
});
var AddProfileView = Backbone.View.extend({
    events: {
        "click .saveBtn": "save"
    },


    initialize: function (options) {
        this.template = _.template($("#addprofile-tmpl").html());
    },


    save: function () {
        var self = this;
        $.ajax({
            url: '/-taddprofile',
            type: 'post',
            data: {
                pid: $('#pid').val(),
                pname: $('#pname').val(),
                pwd: $('#pwd').val(),
                bio: $('#bio').val()
            },
            success: function (data) {
                Backbone.history.navigate("profile/" + $('#pid').val(), true);
            }
        });

        return false;
    },


    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});
var ProfileView = Backbone.View.extend({
    events: {
        "click .editBtn": "edit",
        "click .feedBtn": "addfeed"
    },


    initialize: function (options) {
        this.template = _.template($("#profile-tmpl").html());

        this._views = [];

        var self = this;
        options.items.each(function (m) {
            self._views.push(new BriefItemView({
                model: m
            }));
        });
    },


    edit: function () {
        Backbone.history.navigate("editprofile/" + this.model.get('pid'), true);
        return false;
    },


    addfeed: function () {
        Backbone.history.navigate("addfeed/" + this.model.get('pid'), true);
        return false;
    },


    render: function () {
        $(this.el).html(this.template({
            'data': this.model.toJSON()
        }));
        var self = this;
        _(this._views).each(function (v) {
            $(".items", self.el).append(v.render().el);
        });
        return this;
    }
});
var StaticView = Backbone.View.extend({
    initialize: function (options) {
        this.template = _.template($("#" + options.name + "-tmpl").html());
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});
Application.View.Header = Backbone.Marionette.ItemView.extend({
    template: '#header-template'
});
Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#timeline-private-template',

    appendHtml: function(collectionView, itemView, index){
        collectionView.$('.items').append(itemView.el);
    },


    buildItemView: function(item, ItemViewType, itemViewOptions) {
        item.set('action', 'promote');

        if (item.order == 'ets') {
            return new Application.View.MyCalItem({
                model: item
            });
        } else {
            return new Application.View.MyItem({
                model: item
            });
        }
    },


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

        // this.template = _.template(window.templates['itemlist']);
        // this.templatenow = _.template(window.templates['now']);
        // this.templateitem = _.template(window.templates['otheritem']);
        // this.templatemyitem = _.template(window.templates['myitem']);
        // this.templatecalitem = _.template(window.templates['otheritemcal']);
        // this.templatemycalitem = _.template(window.templates['myitemcal']);


        // this.el = this.options.el;
        // this.itemsModel = this.options.itemsModel;
        // this.myitemsModel = this.options.myitemsModel;
        // this.pid = this.options.pid;

        // this.itemsModel.bind("reset", this.render, this);
        // this.myitemsModel.bind("reset", this.render, this);
        // this.scroller1 = null;
    },

    onCompositeRendered: function (eventName) {
        if (this.scroller) {
            this.scroller.destroy();
        }

        this.scroller = new iScroll(this.$el.find('.content-primary').get(0), {
            momentum: true,
            hScrollbar: false,
            vScroll: true,
            onScrollEnd: this.scrollEnd,
            onRefresh: this.refresh
        });

        // if (this.scroller2) {
        //     this.scroller2.destroy();
        // }

        // $(this.el).html(this.template({
        //     data: {
        //         'pid': this.pid
        //     }
        // }));

        // this.scroller2 = new iScroll('myitemslist', {
        //     momentum: true,
        //     hScrollbar: false,
        //     vScroll: true,
        //     onScrollEnd: this.scrollEnd,
        //     onRefresh: this.refresh
        // });


        // itemsElem   = $("#items", this.el).data('models', this.itemsModel);
        // myitemsElem = $("#myitems", this.el).data('models', this.myitemsModel);

        // itemsElem.html('');
        // itemsElem.closest('div[class^=main-][class$=col]')
        //            .removeClass('ts ets')
        //            .addClass(this.itemsModel.order);

        // myitemsElem.html('');
        // myitemsElem.closest('div[class^=main-][class$=col]')
        //              .removeClass('ts ets')
        //              .addClass(this.myitemsModel.order);


        // var self = this;

        // _.each(this.itemsModel.models, function (item) {
        //     var data = item.toJSON();
        //         data.action = 'promote';

        //     if (this.itemsModel.order == "ets") {
        //         itemsElem.append(this.templatecalitem(data));
        //     } else {
        //         itemsElem.append(this.templateitem(data));
        //     }

        //     itemsElem.find('#ti-' + data.id).data('model', data);
        // }, this);


        // _.each(this.myitemsModel.models, function (item) {
        //     var data = item.toJSON();
        //         data.action = 'demote';

        //     if (this.myitemsModel.order == "ets") {
        //         myitemsElem.append(this.templatemycalitem(data));
        //     } else {
        //         myitemsElem.append(this.templatemyitem(data));
        //     }

        //     myitemsElem.find('#ti-' + data.id).data('model', data);
        // }, this);


        // _.defer(_.bind(function () {
        //     this.scroller1.refresh();
        //     this.scroller2.refresh();
        // }, self));

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
Application.View.Login = Backbone.Marionette.ItemView.extend({
    template: '#login-template',

    events: {
        "keyup input": "change",
        "submit form": "submit"
    },


    change: function (event) {
        var target = event.target;


        this.model.set(target.name, target.value);


        var check = this.model.validateItem(target.id);

        if (check.isValid === false) {
            addValidationError(target.id, check.message);
        } else {
            removeValidationError(target.id);
        }
    },


    submit: function () {
        var check = this.model.validateAll();

        if (check.isValid === false) {
            displayValidationErrors(check.messages);
        } else {
            this.login(this.model.attributes);
        }

        return false;
    },


    login: function (data) {
        var self = this;

        session.set('pid', data.pid);
        session.set('pwd', data.pwd);

        session.save(function (data) {
            console.log("doing navigate");
            Backbone.history.navigate('timeline', true);
            console.log("stopped navigate");
        }, function () {});
    }
});
Application.View.MyCalItem = Backbone.Marionette.ItemView.extend({
    template: '#my-cal-item-template'
});
Application.View.MyItem = Backbone.Marionette.ItemView.extend({
    template: '#my-item-template'
});
Application.View.Register = Backbone.Marionette.ItemView.extend({
    template: '#register-template',

    events: {
        'keyup input': 'change',
        'submit form': 'submit'
    },


    change: function (event) {
        var target = event.target;


        this.model.set(target.name, target.value);


        var check = this.model.validateItem(target.id);

        if (check.isValid === false) {
            addValidationError(target.id, check.message);
        } else {
            removeValidationError(target.id);
        }
    },


    submit: function () {
        var check = this.model.validateAll();

        if (check.isValid === false) {
            displayValidationErrors(check.messages);
        } else {
            this.register();
        }

        return false;
    },


    register: function () {
        // TODO: Use model
        $.ajax({
            url: '/-taddprofile',
            type: 'post',
            data: {
                pid: this.model.get('pid'),
                pwd: this.model.get('pwd'),
                name: this.model.get('name')
            },
            success: function (data) {
                console.log('Created profile successfully');
                Backbone.history.navigate('login', true);
            },
            error: function (model, response, options) {
                console.log('Error thrown when creating profile: ' + response.responseText);
            }
        });
    }
});
Application.View.Timeline = Marionette.ItemView.extend({
    template: '#timeline-template',

    initialize: function() {
        Backbone.Subviews.add(this);
    },


    subviewCreators : {
        publicTimeline: function(a,b,c) {
            return new Application.View.Items({
                pid: session.get('pid'),
                collection: this.options.publicItems
            });
        },

        privateTimeline: function() {
            return new Application.View.Items({
                pid: session.get('pid'),
                collection: this.options.privateItems
            });
        }
    }
});
Application.Router.Admin = Backbone.Router.extend({
    _currentView: null,


    routes: {
        "profile/:pid": "profile",
        "following/:pid": "following",
        "followers/:pid": "followers",
        "feeds/:pid": "feeds",
        "editprofile/:pid": "editprofile",
        "addprofile": "addprofile",
        "addfeed/:pid": "addfeed",
        "*default": "main"
    },


    initialize: function () {
        session.set("ptsession", getCookie("ptsession"));
    },


    main: function () {
        var self = this;
        session.check(function () {
            self.changePage(new MainView({}));
        },

        function () {
            self.invalidSession();
        });
    },


    profile: function (pid) {
        var self = this;
        session.check(function () {

            var profile = new Profile({
                'pid': pid
            });
            profile.fetch({
                success: function () {

                    var items = new ProfileItems({
                        'pid': pid
                    });
                    items.fetch({
                        success: function () {
                            if (profile.get("parentpid")) {
                                self.changePage(new FeedView({
                                    model: profile,
                                    items: items
                                }));
                            } else {
                                self.changePage(new ProfileView({
                                    model: profile,
                                    items: items
                                }));
                            }
                        },
                        error: function () {
                            self.changePage(new MainView({
                                msg: "Problem retrieving profile items for '" + pid + "'"
                            }));
                        }
                    });
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },


    following: function (pid) {
        var self = this;
        session.check(function () {

            var list = new FollowingList({
                'pid': pid
            });
            list.fetch({
                success: function () {
                    self.changePage(new FollowingListView({
                        collection: list
                    }));
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },


    followers: function (pid) {
        var self = this;
        session.check(function () {

            var list = new FollowersList({
                'pid': pid
            });
            list.fetch({
                success: function () {
                    self.changePage(new FollowersListView({
                        collection: list
                    }));
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },


    feeds: function (pid) {
        var self = this;
        session.check(function () {

            var list = new FeedsList({
                'pid': pid
            });
            list.fetch({
                success: function () {
                    self.changePage(new FeedsListView({
                        collection: list
                    }));
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },


    editprofile: function (pid) {
        var self = this;
        session.check(function () {

            var profile = new Profile({
                'pid': pid
            });
            profile.fetch({
                success: function () {
                    if (profile.get("parentpid")) {
                        self.changePage(new EditFeedView({
                            model: profile
                        }));
                    } else {
                        self.changePage(new EditProfileView({
                            model: profile
                        }));
                    }
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });


        },

        function () {
            self.invalidSession();
        });
    },


    addprofile: function () {
        var self = this;
        session.check(function () {
            self.changePage(new AddProfileView({
                el: $('#content')
            }));
        },

        function () {
            self.invalidSession();
        });
    },


    addfeed: function (pid) {
        var self = this;
        session.check(function () {

            var profile = new Profile({
                'pid': pid
            });
            profile.fetch({
                success: function () {
                    self.changePage(new AddFeedView({
                        model: profile
                    }));
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },


    invalidSession: function () {
        self.changePage(new StaticView({
            name: "session"
        }));
    },


    changePage: function (view) {
        if (this._currentView) {
            this._currentView.remove();
        }
        this._currentView = view;


        $('#content').html(view.render().el);

        if (view.postRender) {
            view.postRender();
        }
    }
});
Application.Router.User = Backbone.Router.extend({
    routes: {
        "login": "login",
        "register": "register",
        "timeline": "timeline"
    },


    initialize: function () {
        session.set("ptsession", getCookie("ptsession"));

        var header = new Application.View.Header({
            model: new Backbone.Model({
                pid: session.get('pid')
            })
        });

        Application.header.show(header);
    },


    timeline: function () {
        var self = this;

        session.check(function(){
            var publicItems = new Application.Collection.ItemList();
            var privateItems = new Application.Collection.ItemList();

            publicItems.fetch({
                data: {
                    status: 'p',
                    order: 'ets',
                    pid: session.get('pid')
                }
            });

            privateItems.fetch({
                data: {
                    status: 'm',
                    order: 'ets',
                    pid: session.get('pid')
                }
            });


            var timeline = new Application.View.Timeline({
                publicItems: publicItems,
                privateItems: privateItems
            });

            self.changePage(timeline, 'timeline');
        });
    },


    login: function () {
        var login = new Application.View.Login({
            model: new Application.Model.Credentials()
        });

        this.changePage(login, 'login');
    },


    register: function () {
        var register = new Application.View.Register({
            model: new Application.Model.RegistrationInfo()
        });

        this.changePage(register, 'register');
    },


    logout: function () {
        session.set("ptsession", null);
        setCookie('ptsession', null);

        this.login();
    },


    changePage: function (view, route) {
        console.log("Changing view to " + $(view.el).attr('id'));

        Application.content.show(view);

        if (route) {
            console.log("Changing route to " + route);
            Backbone.history.navigate(route, true);
        }
    }
});