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
            // Load public items
            var publicItems = new Application.Collection.Items(undefined, {
                status: 'p'
            });

            var publicItemsPromise = publicItems.fetch({
                data: {
                    pid: session.get('pid'),
                    before: 5,
                    after: 5
                }
            });


            // Load private items
            var privateItems = new Application.Collection.Items(undefined, {
                status: 'm'
            });

            var privateItemsPromise = privateItems.fetch({
                data: {
                    pid: session.get('pid'),
                    before: 5,
                    after: 5
                }
            });


            $.when(publicItemsPromise, privateItemsPromise).done(function(){
                var timeline = new Application.View.Timeline({
                    publicItems: publicItems,
                    privateItems: privateItems,

                    pid: session.get('pid')
                });

                Application.content.show(timeline);
            });
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