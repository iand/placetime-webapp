var Application = new Backbone.Marionette.Application();

Application.Model = {};
Application.View = {};
Application.Collection = {};
Application.Router = {};


// Regions
Application.addRegions({
    header: 'body > .header',
    content: 'body > .content',
    footer: 'body > .footer'
});


// TODO: Remove global variable
var session;
Application.addInitializer(function(options){
    session = new Application.Model.Session();


    var cookie = $.cookie('ptsession');
    if (cookie) {
        session.set('ptsession', cookie);
    }
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
    idAttribute: 'id',

    promote: function(done, fail) {
        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        $.ajax({
            url: '/-tpromote',
            type: 'post',
            data: {
                pid: session.get("pid"),
                id: this.get('id')
            },
            success: function() {
                defer.resolve();
            },
            failure: function() {
                defer.reject();
            }
        });

        return defer.promise();
    },


    demote: function(done, fail) {
        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        $.ajax({
            url: '/-tdemote',
            type: 'post',
            data: {
                pid: session.get("pid"),
                id: this.get('id')
            },
            success: function() {
                defer.resolve();
            },
            failure: function() {
                defer.reject();
            }
        });

        return defer.promise();
    }
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
    initialize: function () {
        var cookie = $.cookie('ptsession');

        if (cookie !== undefined) {
            this.set('pid', cookie.split('|')[0]);
        }
    },


    check: function (done, fail) {
        var self = this;


        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);


        if (this.get('ptsession')) {
            $.ajax({
                url: '/-chksession'
            })
            .done(function () {
                var cookie = $.cookie('ptsession');

                if (cookie !== undefined) {
                    self.set('pid', cookie.split('|')[0]);
                }

                defer.resolve();
            })
            .fail(function () {
                self.set('pid', null);
                defer.reject();
            });
        } else {
            defer.reject();
        }


        return defer.promise();
    },



    save: function (done, fail) {
        var self = this;


        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        $.ajax({
            url: '/-session',
            type: 'post',
            data: {
                pid: self.get('pid'),
                pwd: self.get('pwd')
            }
        })
        .done(function (data) {
            self.set('pwd', null);
            self.set('ptsession', $.cookie('ptsession'));

            defer.resolve(data);
        })
        .fail(function (data) {
            self.set('pwd', null);

            defer.fail(data);
        });


        return defer.promise();
    },



    destroy: function () {
        // TODO: Replace with XHR call
        $.cookie('ptsession', null);

        Backbone.Model.prototype.destroy.apply(this);
    }
});
Application.Collection.Feeds = Backbone.Collection.extend({
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
Application.Collection.Items = Backbone.Collection.extend({
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
    },


    comparator: function(model) {
        return -moment(model.get('ets')).unix();
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
    template: '#header-template',
    className: 'navbar navbar-fixed'
});
Application.View.Item = Backbone.Marionette.ItemView.extend({
    template: '#item-template',
    className: 'item',

    remove: function() {
        this.$el.animate({
            opacity: 0,
            height: 0,
            marginTop: 0,
            paddingTop: 0,
            marginBottom: 0,
            paddingBottom: 0
        }, 'slow', function () {
            $(this).remove();
        });

        this.stopListening();

        return this;
    },

    beforeRender: function() {
        this.$el.css({
            opacity: 0,
            height: 0
        });
    },

    onRender: function() {
        this.$el.animate({
            height: 150,
            opacity: 1
        }, 'slow');
    }
});
Application.View.Items = Backbone.Marionette.CompositeView.extend({
    template: '#timeline-template',
    className: 'column',

    events: {
        'click .button.promote': 'promote',
        'click .button.demote': 'demote'
    },

    itemViewContainer: '.foo',


    initialize: function (options) {
        var self = this;

        // Scroller events
        this.on('composite:rendered', this.bindScroller);
        this.on('after:item:added', this.refreshScroller);
        this.on('item:removed', this.refreshScroller);

        // Adjust scroller height
        $(window).resize(function(){
            var $scroller = self.$el.find('.scroller');

            $scroller.height(
                $(this).height() - 100
            );
        });
    },


    bindScroller: function () {
        if (this.scroller) {
            this.scroller.destroy();
        }

        var $scroller = this.$el.find('.scroller');

        $scroller.height(
            $(window).height() - 100
        );

        this.scroller = new iScroll($scroller.get(0), {
            momentum: true,
            hScrollbar: false,
            vScroll: true
        });

        return this;
    },


    refreshScroller: function() {
        var self = this;

        clearTimeout(this.timeout);

        this.timeout = setTimeout(function(){
            self.scroller.refresh();
        }, jQuery.fx.speeds.slow);
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

        // TODO: Look into event bubbling
        this.collection.trigger('item:promoted', model);
        this.collection.remove(model);

        return false;
    },



    demote: function (event) {
        var $item = $(event.currentTarget).closest('[data-id]');

        var self = this;

        var model = this.collection.get(
            $item.data('id')
        );
        model.demote();

        // TODO: Look into event bubbling
        this.collection.trigger('item:demoted', model);
        this.collection.remove(model);

        return false;
    },


    appendHtml: function(collectionView, itemView, index) {
        var itemViewContainer;
        if (collectionView.itemViewContainer) {
            itemViewContainer = collectionView.$(collectionView.itemViewContainer);
        } else {
            itemViewContainer = collectionView.$el;
        }

        if (itemViewContainer.children().size() <= index) {
            itemViewContainer.append(itemView.el);
        } else {
            itemViewContainer.children().eq(index).before(itemView.el);
        }
    },


    buildItemView: function(item, ItemViewType, itemViewOptions) {
        if (this.model.get('status') === 'p') {
            item.set('action', 'promote');
        } else {
            item.set('action', 'demote');
        }

        return new Application.View.Item({
            model: item
        });
    }
});
Application.View.Login = Backbone.Marionette.ItemView.extend({
    template: '#login-template',
    className: 'container',

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
            this.login(this.model.attributes);
        }

        return false;
    },


    login: function (data) {
        var self = this;

        session.set('pid', data.pid);
        session.set('pwd', data.pwd);

        session.save(function (data) {
            console.log('doing navigate');
            Backbone.history.navigate('timeline', true);
            console.log('stopped navigate');
        }, function () {});
    }
});
Application.View.Register = Backbone.Marionette.ItemView.extend({
    template: '#register-template',
    className: 'container',

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
    template: '#timelines-template',
    className: 'container timelines',

    initialize: function() {
        Backbone.Subviews.add(this);
    },


    subviewCreators : {
        publicTimeline: function() {
            var timeline = new Application.View.Items({
                model: new Backbone.Model({
                    status: 'p',
                    pid: this.options.pid
                }),
                collection: this.options.publicItems
            });
            timeline.listenTo(this.options.privateItems, 'item:demoted', timeline.addItem);

            return timeline;
        },

        privateTimeline: function() {
            var timeline = new Application.View.Items({
                model: new Backbone.Model({
                    status: 'm',
                    pid: this.options.pid
                }),
                collection: this.options.privateItems
            });
            timeline.listenTo(this.options.publicItems, 'item:promoted', timeline.addItem);

            return timeline;
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
        session.set("ptsession", $.cookie('ptsession'));
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

            var list = new Application.Collection.Feeds({
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
        'login': 'login',
        'logout': 'logout',
        'register': 'register',
        'timeline': 'timeline'
    },


    initialize: function () {
        var header = new Application.View.Header({
            model: new Backbone.Model({
                pid: session.get('pid')
            })
        });

        Application.header.show(header);
    },


    timeline: function () {
        var self = this;


        var check = session.check();

        check.done(function(){
            var publicItems = new Application.Collection.Items();
            var privateItems = new Application.Collection.Items();

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

            Application.content.show(timeline);
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },


    login: function () {
        var login = new Application.View.Login({
            model: new Application.Model.Credentials()
        });

        Application.content.show(login);
    },


    register: function () {
        var register = new Application.View.Register({
            model: new Application.Model.RegistrationInfo()
        });

        Application.content.show(register);
    },


    logout: function () {
        session.destroy();

        Backbone.history.navigate('login', true);
    }
});