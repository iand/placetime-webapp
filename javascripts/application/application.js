var Application = new Backbone.Marionette.Application();

Application.Admin = {
    Model: {},
    View: {},
    Collection: {},
    Router: {}
};

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

Backbone.Marionette.Region.prototype.is = function(view) {
    if (this.currentView === view) {
        return true;
    } else if (this.currentView === undefined) {
        return false;
    }  else if (this.currentView.name === view) {
        return true;
    } else {
        return false;
    }
};


// Backbone.Marionette.Region.prototype.show = function(view,b,c) {
//     this.ensureEl();
//     this.$el.replaceWith(view.el);
// };


Application.addInitializer(function(options){
    Application.session = new Application.Model.Session();


    var cookie = $.cookie('ptsession');
    if (cookie) {
        Application.session.set('ptsession', cookie);
    }
});



Application.addInitializer(function(options){
    if (options.router === 'admin') {
        Application.router = new Application.Router.Admin();
    } else {
        Application.router = new Application.Router.User();
    }
});


// TODO: Move
Application.addInitializer(function(){
    var closeBtn = '<a title="Close" class="fancybox-item fancybox-close">';
        closeBtn += '<i class="icon-remove-circle"></i>';
        closeBtn += '</a>';

    $('.fancybox').fancybox({
        maxWidth    : 970,
        maxHeight   : 800,
        fitToView   : false,
        width       : '70%',
        height      : '90%',
        autoSize    : false,
        closeClick  : false,
        openEffect  : 'none',
        closeEffect : 'none',
        arrows      : false,

        tpl: {
            closeBtn : closeBtn
        }
    });
});


// Start history and check session
Application.on('initialize:after', function(options){
    var matched = Backbone.history.start({
        root: '/'
    });

    Application.session.check(function(){
        if (matched) {
            return;
        } else {
            Backbone.history.navigate('timeline', true);
        }
    }, function(){
        if (['login', 'register'].indexOf(Backbone.history.fragment) !== -1) {
            return;
        } else {
            Backbone.history.navigate('login', true);
        }
    });
});