Application.Router.User = Backbone.Router.extend({
    routes: {
        'login': 'login',
        'logout': 'logout',
        'register': 'register',

        'timeline': 'timeline',
        'followings': 'followings',
        'followers': 'followers',
        'profile': 'profile',

        'user/:id': 'timeline',
        'followers/:id': 'followers',
        'followings/:id': 'followings',
        'search/:query': 'search'
    },


    initialize: function () {
        // TODO: Set object name to body class, override Application.content.show
        this.header = new Application.View.Header({
            model: new Backbone.Model({
                pid: Application.session.get('pid'),
                wide: false
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
            // Set header to wide and re-render
            self.header.model.set('wide', true);
            self.header.render();

            if (pid === Application.session.get('pid')) {
                pid = undefined;
            }

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


            if (Application.content.is('timelines') === true) {
                Application.content.currentView.trigger('public:timeline', pid);
            } else {
                Application.content.show(timeline);
            }
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },


    search: function (query) {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            // Set header to wide and re-render
            self.header.model.set('wide', true);
            self.header.render();


            // Render timelines
            var timeline = new Application.View.Timelines({
                public: {
                    pid: Application.session.get('pid'),
                    view: 'search'
                },
                private: {
                    pid: Application.session.get('pid'),
                    view: 'timeline'
                }
            });


            if (Application.content.is('timelines') === true) {
                Application.content.currentView.trigger('public:search', query);
            } else {
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
            // Set header to wide and re-render
            self.header.model.set('wide', true);
            self.header.render();


            if (pid === undefined) {
                pid = Application.session.get('pid');
            }

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


            if (Application.content.is('timelines')) {
                Application.content.currentView.trigger('public:followers', pid);
            } else {
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
            // Set header to wide and re-render
            self.header.model.set('wide', true);
            self.header.render();


            if (pid === undefined) {
                pid = Application.session.get('pid');
            }

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


            if (Application.content.is('timelines')) {
                Application.content.currentView.trigger('public:followings', pid);
            } else {
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
            model: new Application.Model.RegistrationInfo()
        });

        Application.content.show(register);
    },



    logout: function () {
        Application.session.destroy();

        Backbone.history.navigate('login', true);
    }
});