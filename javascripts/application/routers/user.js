Application.Router.User = Backbone.Router.extend({
    routes: {
        'login': 'login',
        'logout': 'logout',
        'register': 'register',

        'timeline': 'timeline',
        'followings': 'followings',
        'followers': 'followers',
        'suggestions': 'suggestions',

        'user': 'user',
        'user/email': 'userEmail',

        'user/:id': 'timeline',
        'followers/:id': 'followers',
        'followings/:id': 'followings',
        'search/:type/:search': 'search'
    },


    initialize: function () {
        this.header = new Application.View.Header({
            model: Application.session
        });

        Application.header.show(this.header);
    },



    timeline: function (pid) {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            if (pid === Application.session.get('pid')) {
                pid = undefined;
            }


            if (Application.content.is('timelines') === true) {
                Application.content.currentView.trigger('public:timeline', {
                    pid: pid
                });
            } else {
                // Render timelines
                var timeline = new Application.View.Timelines({
                    public: {
                        pid: Application.session.get('pid'),
                        view: 'timeline',
                        options: {
                            pid: pid
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


    search: function (type, search) {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            if (Application.content.is('timelines') === true) {
                Application.content.currentView.trigger('public:search', {
                    type: type,
                    search: search
                });
            } else {
                // Render timelines
                var timeline = new Application.View.Timelines({
                    public: {
                        pid: Application.session.get('pid'),
                        view: 'search',
                        options: {
                            type: type,
                            search: search
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
                Application.content.currentView.trigger('public:followers', {
                    pid: pid
                });
            } else {
                // Render timelines
                var timeline = new Application.View.Timelines({
                    public: {
                        pid: pid,
                        view: 'followers',
                        options: {
                            pid: pid
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



    followings: function(pid) {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            if (pid === undefined) {
                pid = Application.session.get('pid');
            }


            if (Application.content.is('timelines')) {
                Application.content.currentView.trigger('public:followings', {
                    pid: pid
                });
            } else {
                // Render timelines
                var timeline = new Application.View.Timelines({
                    public: {
                        pid: pid,
                        view: 'followings',
                        options: {
                            pid: pid
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



    user: function () {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            var profile = new Application.View.User({
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



    userEmail: function () {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            var profile = new Application.View.UserEmail({
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



    suggestions: function () {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            var suggestions = new Application.View.Suggestions({
                collection : new Application.Collection.Suggestions(),
                model      : new Backbone.Model({
                    loading: false
                })
            });

            Application.content.show(suggestions);
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
            model: new Application.Model.Register()
        });

        Application.content.show(register);
    },



    logout: function () {
        Application.session.destroy();

        Backbone.history.navigate('login', true);
    }
});