Application.Router.User = Backbone.Router.extend({
    routes: {
        'login': 'login',
        'logout': 'logout',
        'register': 'register',

        'timeline': 'timeline',
        'followings': 'followings',
        'followers': 'followers',

        'profile': 'profile',
        'profile/email': 'profileEmail',

        'user/:id': 'timeline',
        'followers/:id': 'followers',
        'followings/:id': 'followings',
        'search/:type/:query': 'search'
    },


    initialize: function () {
        // TODO: Set object name to body class, override Application.content.show
        this.header = new Application.View.Header({
            model: new Backbone.Model({
                pid: Application.session.get('pid')
            })
        });

        Application.header.show(this.header);
    },



    timeline: function (pid) {
        var self = this;


        // TODO: Remove eventually
        $('body').removeClass('login');

        var check = Application.session.check();

        check.done(function(){
            if (pid === Application.session.get('pid')) {
                pid = undefined;
            }


            if (Application.content.is('timelines') === true) {
                Application.content.currentView.trigger('public:timeline', pid);
            } else {
                // Render timelines
                var timeline = new Application.View.Timelines({
                    public: {
                        pid: Application.session.get('pid'),
                        view: 'timeline'
                    },
                    private: {
                        pid: Application.session.get('pid'),
                        view: 'timeline'
                    }
                });

                Application.content.show(timeline);
            }
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },


    search: function (type, query) {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            if (Application.content.is('timelines') === true) {
                Application.content.currentView.trigger('public:search', {
                    type: type,
                    query: query
                });
            } else {
                // Render timelines
                var timeline = new Application.View.Timelines({
                    public: {
                        pid: Application.session.get('pid'),
                        view: 'search',
                        options: {
                            type: type,
                            query: query
                        }
                    },
                    private: {
                        pid: Application.session.get('pid'),
                        view: 'timeline'
                    }
                });

                Application.content.show(timeline);
            }
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },


    followers: function(pid) {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            if (pid === undefined) {
                pid = Application.session.get('pid');
            }


            if (Application.content.is('timelines')) {
                Application.content.currentView.trigger('public:followers', pid);
            } else {
                // Render timelines
                var timeline = new Application.View.Timelines({
                    public: {
                        pid: pid,
                        view: 'followers'
                    },
                    private: {
                        pid: Application.session.get('pid'),
                        view: 'timeline'
                    }
                });

                Application.content.show(timeline);
            }
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },



    followings: function(pid) {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            if (pid === undefined) {
                pid = Application.session.get('pid');
            }


            if (Application.content.is('timelines')) {
                Application.content.currentView.trigger('public:followings', pid);
            } else {
                // Render timelines
                var timeline = new Application.View.Timelines({
                    public: {
                        pid: pid,
                        view: 'followings'
                    },
                    private: {
                        pid: Application.session.get('pid'),
                        view: 'timeline'
                    }
                });

                Application.content.show(timeline);
            }
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },



    profile: function () {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            var profile = new Application.View.Profile({
                model: new Application.Model.Profile({
                    pid: Application.session.get('pid')
                })
            });

            Application.content.show(profile);
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },



    profileEmail: function () {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            var profile = new Application.View.ProfileEmail({
                model: new Application.Model.Profile({
                    pid: Application.session.get('pid')
                })
            });

            Application.content.show(profile);
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },



    login: function () {
        var login = new Application.View.Login({
            model: new Application.Model.Credentials()
        });

        // TODO: Remove and replace with backbone region show override
        $('body').addClass('login');

        Application.content.show(login);
    },



    register: function () {
        var register = new Application.View.Register({
            model: new Application.Model.Register()
        });

        Application.content.show(register);
    },



    logout: function () {
        Application.session.destroy();

        Backbone.history.navigate('login', true);
    }
});