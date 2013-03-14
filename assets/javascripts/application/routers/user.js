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