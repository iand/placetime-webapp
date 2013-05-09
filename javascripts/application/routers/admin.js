Application.Router.Admin = Backbone.Router.extend({
    _currentView: null,


    routes: {
        'login': 'login',
        'logout': 'logout',

        'profile/new' : 'profileNew',
        'profile/:pid/edit': 'profileEdit',
        'profile/:pid': 'profileView',

        'profile/:pid/following': 'following',
        'profile/:pid/followers': 'followers',

        'profile/:pid/feeds': 'feeds',

        'addfeed/:pid': 'addfeed',

        '*default': 'home'
    },


    initialize: function () {
        var header = new Application.View.Header({
            model: new Backbone.Model({
                pid: Application.session.get('pid')
            })
        });

        Application.header.show(header);


        // var self = this;
        // Application.session.check(function () {
        //     self.changePage(new MainView({}));
        // },

        // function () {
        //     self.invalidSession();
        // });
    },



    login: function () {
        var login = new Application.View.Login({
            model: new Application.Model.Credentials()
        });

        Application.content.show(login);
    },



    home: function () {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            var home = new Application.Admin.View.Home({
                model: new Backbone.Model({
                    pid: Application.session.get('pid'),
                    message: undefined
                })
            });
            Application.content.show(home);
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },


    profileView: function (pid) {
        var self = this;


        var check = Application.session.check();

        check.done(function () {
            var profile = new Application.Model.Profile({
                'pid': pid
            });


            profile.fetch().done(function(){
                var items = new ProfileItems({
                    'pid': pid
                });

                items.fetch().done(function(){
                    if (profile.get('parentpid')) {
                        self.changePage(new FeedView({
                            model: profile,
                            items: items
                        }));
                    } else {
                        var view = new Application.Admin.View.ProfileView({
                            model: new Backbone.Model({
                                model: profile,
                                items: items
                            })
                        });
                        Application.content.show(view);
                    }
                }).fail(function () {
                    var view = new Application.Admin.View.Home({
                        model: new Backbone.Model({
                            message: "Problem retrieving profile items for '" + pid + "'"
                        })
                    });
                    Application.content.show(view);
                });
            })

            .fail(function(){
                var view = new Application.Admin.View.Home({
                    model: new Backbone.Model({
                        message: "Problem retrieving profile '" + pid + "'"
                    })
                });
                Application.content.show(view);
            });
        });


        check.fail(function () {
            self.invalidSession();
        });
    },



    following: function (pid) {
        var self = this;
        Application.session.check(function () {

            var list = new FollowingList({
                'pid': pid
            });
            list.fetch({
                success: function () {
                    self.changePage(new FollowingListView({
                        collection: list
                    }));
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },



    followers: function (pid) {
        var self = this;
        Application.session.check(function () {

            var list = new FollowersList({
                'pid': pid
            });
            list.fetch({
                success: function () {
                    self.changePage(new FollowersListView({
                        collection: list
                    }));
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },



    feeds: function (pid) {
        var self = this;
        Application.session.check(function () {

            var list = new Application.Collection.Feeds({
                'pid': pid
            });
            list.fetch({
                success: function () {
                    self.changePage(new FeedsListView({
                        collection: list
                    }));
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },



    profileEdit: function (pid) {
        var self = this;
        Application.session.check(function () {

            var profile = new Profile({
                'pid': pid
            });
            profile.fetch({
                success: function () {
                    if (profile.get("parentpid")) {
                        self.changePage(new EditFeedView({
                            model: profile
                        }));
                    } else {
                        self.changePage(new EditProfileView({
                            model: profile
                        }));
                    }
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });


        },

        function () {
            self.invalidSession();
        });
    },



    profileNew: function () {
        var self = this;


        var check = Application.session.check();

        check.done(function(){
            Application.content.show(
                new Application.Admin.View.ProfileNew()
            );
        });


        check.fail(function(){
            Backbone.history.navigate('login', true);
        });
    },



    addfeed: function (pid) {
        var self = this;
        Application.session.check(function () {

            var profile = new Profile({
                'pid': pid
            });
            profile.fetch({
                success: function () {
                    self.changePage(new AddFeedView({
                        model: profile
                    }));
                },
                error: function () {
                    self.changePage(new MainView({
                        msg: "Problem retrieving profile '" + pid + "'"
                    }));
                }
            });
        },

        function () {
            self.invalidSession();
        });
    },



    invalidSession: function () {
        self.changePage(new StaticView({
            name: "Application.session"
        }));
    }
});