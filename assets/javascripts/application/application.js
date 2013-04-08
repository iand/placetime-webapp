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