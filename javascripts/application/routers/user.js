Application.Router.User = Backbone.Router.extend({
    routes: {
        'login': 'login',
        'logout': 'logout',
        'register': 'register',

        'timeline': 'timeline',
        'followings': 'followings',
        'followers': 'followers',

        'user/:id': 'user'
    },


    initialize: function () {
        // TODO: Set object name to body class, override Application.content.show
        this.header = new Application.View.Header({
            model: new Backbone.Model({
                pid: session.get('pid'),
                wide: false
            })
        });

        Application.header.show(this.header);
    },



    timeline: function () {
        var self = this;


        var check = session.check();

        check.done(function(){
            // Set header to wide and re-render
            self.header.model.set('wide', true);
            self.header.render();

            // Render timelines
            var timeline = new Application.View.Timelines({
                public: {
                    pid: session.get('pid'),
                    view: 'timeline'
                },
                private: {
                    pid: session.get('pid'),
                    view: 'timeline'
                }
            });


            if (Application.content.currentView && Application.content.currentView.isClosed === false) {
                Application.content.currentView.trigger('public:timeline');
            } else {
                Application.content.show(timeline);
            }
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },



    followers: function() {
        var self = this;


        var check = session.check();

        check.done(function(){
            // Set header to wide and re-render
            self.header.model.set('wide', true);
            self.header.render();

            // Render timelines
            var timeline = new Application.View.Timelines({
                public: {
                    pid: session.get('pid'),
                    view: 'followers'
                },
                private: {
                    pid: session.get('pid'),
                    view: 'timeline'
                }
            });


            if (Application.content.currentView && Application.content.currentView.isClosed === false) {
                Application.content.currentView.trigger('public:followers');
            } else {
                Application.content.show(timeline);
            }
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },



    followings: function() {
        var self = this;


        var check = session.check();

        check.done(function(){
            // Set header to wide and re-render
            self.header.model.set('wide', true);
            self.header.render();

            // Render timelines
            var timeline = new Application.View.Timelines({
                public: {
                    pid: session.get('pid'),
                    view: 'followings'
                },
                private: {
                    pid: session.get('pid'),
                    view: 'timeline'
                }
            });


            if (Application.content.currentView && Application.content.currentView.isClosed === false) {
                Application.content.currentView.trigger('public:followings');
                Application.content.currentView.trigger('private:followings');
            } else {
                Application.content.show(timeline);
            }
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



    user: function (pid) {
        var self = this;


        var check = session.check();

        check.done(function(){
            // Set header to wide and re-render
            self.header.model.set('wide', true);
            self.header.render();

            // Render timelines
            var timeline = new Application.View.Timelines({
                public: {
                    pid: pid,
                    view: 'timeline'
                },
                private: {
                    pid: session.get('pid'),
                    view: 'timeline'
                }
            });

            Application.content.show(timeline);
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },



    logout: function () {
        session.destroy();

        Backbone.history.navigate('login', true);
    }
});