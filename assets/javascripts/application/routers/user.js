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