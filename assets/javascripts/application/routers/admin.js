Application.Router.Admin = Backbone.Router.extend({
    _currentView: null,


    routes: {
        "profile/:pid": "profile",
        "following/:pid": "following",
        "followers/:pid": "followers",
        "feeds/:pid": "feeds",
        "editprofile/:pid": "editprofile",
        "addprofile": "addprofile",
        "addfeed/:pid": "addfeed",
        "*default": "main"
    },


    initialize: function () {
        session.set("ptsession", $.cookie('ptsession'));
    },


    main: function () {
        var self = this;
        session.check(function () {
            self.changePage(new MainView({}));
        },

        function () {
            self.invalidSession();
        });
    },


    profile: function (pid) {
        var self = this;
        session.check(function () {

            var profile = new Profile({
                'pid': pid
            });
            profile.fetch({
                success: function () {

                    var items = new ProfileItems({
                        'pid': pid
                    });
                    items.fetch({
                        success: function () {
                            if (profile.get("parentpid")) {
                                self.changePage(new FeedView({
                                    model: profile,
                                    items: items
                                }));
                            } else {
                                self.changePage(new ProfileView({
                                    model: profile,
                                    items: items
                                }));
                            }
                        },
                        error: function () {
                            self.changePage(new MainView({
                                msg: "Problem retrieving profile items for '" + pid + "'"
                            }));
                        }
                    });
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


    following: function (pid) {
        var self = this;
        session.check(function () {

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
        session.check(function () {

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
        session.check(function () {

            var list = new FeedsList({
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


    editprofile: function (pid) {
        var self = this;
        session.check(function () {

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


    addprofile: function () {
        var self = this;
        session.check(function () {
            self.changePage(new AddProfileView({
                el: $('#content')
            }));
        },

        function () {
            self.invalidSession();
        });
    },


    addfeed: function (pid) {
        var self = this;
        session.check(function () {

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
            name: "session"
        }));
    },


    changePage: function (view) {
        if (this._currentView) {
            this._currentView.remove();
        }
        this._currentView = view;


        $('#content').html(view.render().el);

        if (view.postRender) {
            view.postRender();
        }
    }
});