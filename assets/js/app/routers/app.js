Application.Router.App = Backbone.Router.extend({
    routes: {
        "login": "login",
        "register": "register",
        "*default": "timeline"
    },


    initialize: function () {
        session.set("ptsession", getCookie("ptsession"));
    },


    timeline: function () {
        var self = this;
        session.check(function () {
            var items = new Application.Collection.ItemList();
            items.order = "ets";
            items.pid = session.get("pid");
            items.status = 'p';
            items.refresh();

            var myItems = new Application.Collection.ItemList();
            myItems.order = items.order;
            myItems.pid = items.pid;
            myItems.status = 'm';
            myItems.refresh();



            self.changePage(new Application.View.ItemsView({
                el: $('#content'),
                itemsModel: items,
                myitemsModel: myItems,
                pid: session.get("pid")
            }));

        },

        function () {
            self.login();
        });
    },


    login: function () {
        console.log("Routed to login");
        var self = this;
        session.set("ptsession", null);
        setCookie('ptsession', null);
        this.changePage(new Application.View.LoginView({
            el: $('#content'),
            model: new Application.Model.Credentials()
        }), 'login');
    },


    register: function () {
        console.log("Routed to register");
        var self = this;
        session.set("ptsession", null);
        setCookie('ptsession', null);
        this.changePage(new Application.View.RegisterView({
            el: $('#content'),
            model: new Application.Model.RegistrationInfo()
        }));
    },


    logout: function () {
        this.login();
    },


    changePage: function (view, route) {
        console.log("Changing view to " + $(view.el).attr('id'));
        view.render();
        if (view.postRender) {
            view.postRender();
        }

        if (route) {
            console.log("Changing route to " + route);
            Backbone.history.navigate(route, true);
        }
    }
});