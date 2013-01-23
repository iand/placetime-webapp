$(function(){
    var Profile = Backbone.Model.extend({

      url: function() {
        return '/-jpr?pid=' + this.get('pid');
      }
    });

    var Feed = Backbone.Model.extend({

    });

    var Item = Backbone.Model.extend({

    });

    var ProfileItems = Backbone.Collection.extend({
      model: Item

      ,initialize: function(options) {
        this.pid = options.pid;
      }

      ,url: function() {
        return '/-jtl?status=m&count=30&pid=' + this.pid;
      }
    });

    var FollowingList = Backbone.Collection.extend({
      model: Profile

      ,initialize: function(options) {
        this.pid = options.pid;
      }

      ,url: function() {
        return '/-jfollowing?count=40&pid=' + this.pid;
      }

    });

    var FollowersList = Backbone.Collection.extend({
      model: Profile

      ,initialize: function(options) {
        this.pid = options.pid;
      }

      ,url: function() {
        return '/-jfollowers?count=40&pid=' + this.pid;
      }

    });    

    var FeedsList = Backbone.Collection.extend({
      model: Feed

      ,initialize: function(options) {
        this.pid = options.pid;
      }

      ,url: function() {
        return '/-jfeeds?pid=' + this.pid;
      }

    });    


    var MainView = Backbone.View.extend({
      
      initialize: function(options) {
       this.template = _.template($("#main-tmpl").html());
       this.msg = options.msg;
      }

      ,render:function () {
        $(this.el).html(this.template({data:{msg:this.msg}}));
        return this;
      }
    
      ,events: {
        "click .profileBtn" : "profile"
      }
    
      ,profile: function(){
        Backbone.history.navigate("profile/" + $('#pid').val(), true);
        return false;
      }
    
    });

    var StaticView = Backbone.View.extend({
    
      initialize: function(options) {
       this.template = _.template($("#" + options.name +"-tmpl").html());
      }

      ,render:function () {
        $(this.el).html(this.template());
        return this;
      }
        
    });


    var ProfileView = Backbone.View.extend({
    
      initialize: function(options) {
        this.template = _.template($("#profile-tmpl").html());

        this._views = [];

        var self = this;
        options.items.each(function(m) {
          self._views.push(new BriefItemView({
            model : m,
          }));
        });     

      }

      ,render:function () {
        $(this.el).html(this.template({'data': this.model.toJSON()}));
        var self = this;
        _(this._views).each(function(v) {
          $(".items", self.el).append(v.render().el);
        })        
        return this;
      }

      ,events: {
        "click .editBtn" : "edit"
        ,"click .feedBtn" : "addfeed"
      }

      ,edit: function(){
        Backbone.history.navigate("editprofile/" + this.model.get('pid'), true);
        return false;
      }

      ,addfeed: function(){
        Backbone.history.navigate("addfeed/" + this.model.get('pid'), true);
        return false;
      }      
        
    });

    var EditProfileView = Backbone.View.extend({
    
      initialize: function(options) {
       this.template = _.template($("#editprofile-tmpl").html());
      }

      ,render:function () {
        $(this.el).html(this.template({'data': this.model.toJSON()}));
        return this;
      }

      ,events: {
        "click .saveBtn" : "save"
      }

      ,save: function(){
        var self = this;
        $.ajax({
            url:'/-tupdateprofile',
            type:'post',
            data: { pid: this.model.get('pid')
              ,bio: $('#bio').val()
              ,pname: $('#pname').val()
              ,parentpid: $('#parentpid').val()
              ,feedurl: $('#feedurl').val()
             },
            success:function (data) {
              Backbone.history.navigate("profile/" + self.model.get('pid'), true);
            }
        });          

        console.log("save");
        return false;
      }
        
    });

    var FeedView = Backbone.View.extend({
    
      initialize: function(options) {
        this.template = _.template($("#feed-tmpl").html());
        this.msg = "";
        this.initItemViews(options.items);
 
      }


      ,initItemViews: function(items) {
        this._views = [];

        var self = this;
        items.each(function(m) {
          self._views.push(new BriefItemView({
            model : m,
          }));
        });    
      }

      ,render:function () {
        $(this.el).html(this.template({'data': this.model.toJSON()}));

        $(".msg", this.el).html(this.msg);
        
        var self = this;
        _(this._views).each(function(v) {
          $(".items", self.el).append(v.render().el);
        })        
        return this;
      }

      ,events: {
        "click .editBtn" : "edit"
        ,"click .refreshBtn" : "refresh"
        ,"click .deleteBtn" : "delete"
      }

      ,edit: function(){
        Backbone.history.navigate("editprofile/" + this.model.get('pid'), true);
        return false;
      }

      ,refresh: function(){
        var self = this;
        $.ajax({
            url:'/-refresh',
            type:'get',
            data: { pid: self.model.get('pid') },
            success:function (data) {
              var items = new ProfileItems({'pid':self.model.get('pid')});
              items.fetch({ 
                success: function() { 
                  self.initItemViews(items);
                  self.msg = "";
                  self.render();                 
                },
                error: function(request, status, error) {
                  self.msg = "There was a problem displaying feed items: " + request.responseText;
                  self.render();                 
                } 
              }); 

            },
            error: function(request, status, error) {
              self.msg = "There was a problem refreshing feed items: " + request.responseText;
              self.render();                 
            }             
        });  

        return false;
      }   

      ,delete: function(){
        var self = this;
        $.ajax({
            url:'/-tremprofile',
            type:'post',
            data: { pid: self.model.get('pid') },
                success: function() { 
                  Backbone.history.navigate("profile/" + self.model.get('parentpid'), true);
                },
                error: function(request, status, error) {
                  self.msg = "There was a problem deleting the feed: " + request.responseText;
                  self.render();                 
                }       
        });  

        return false;
      }      
    });

    var EditFeedView = Backbone.View.extend({
    
      initialize: function(options) {
       this.template = _.template($("#editfeed-tmpl").html());
      }

      ,render:function () {
        $(this.el).html(this.template({'data': this.model.toJSON()}));
        return this;
      }

      ,events: {
        "click .saveBtn" : "save"
      }

      ,save: function(){
        console.log("saving feed: " + $('#pname').val());
        console.log("pid: " + this.model.get('pid'));
        console.log("pname: " + $('#pname').val());
        console.log("parentpid: " + $('#parentpid').val());
        console.log("feedurl: " + $('#feedurl').val());
        var self = this;
        $.ajax({
            url:'/-tupdateprofile',
            type:'post',
            data: { pid: this.model.get('pid')
              ,pname: $('#pname').val()
              ,parentpid: $('#parentpid').val()
              ,feedurl: $('#feedurl').val()
             },
            success:function (data) {
              Backbone.history.navigate("profile/" + self.model.get('pid'), true);
            }
        });          

        return false;
      }
        
    });

    var AddProfileView = Backbone.View.extend({
    
      initialize: function(options) {
       this.template = _.template($("#addprofile-tmpl").html());
      }

      ,render:function () {
        $(this.el).html(this.template());
        return this;
      }

      ,events: {
        "click .saveBtn" : "save"
      }

      ,save: function(){
        var self = this;
        $.ajax({
            url:'/-taddprofile',
            type:'post',
            data: { 
               pid: $('#pid').val()
              ,pname: $('#pname').val()
              ,pwd: $('#pwd').val()
              ,bio: $('#bio').val()
             },
            success:function (data) {
              Backbone.history.navigate("profile/" + $('#pid').val(), true);
            }
        });          

        return false;
      }
        
    });

    var AddFeedView = Backbone.View.extend({
    
      initialize: function(options) {
       this.template = _.template($("#addfeed-tmpl").html());
      }

      ,render:function () {
        $(this.el).html(this.template({'data': this.model.toJSON()}));
        return this;
      }

      ,events: {
        "click .saveBtn" : "save"
      }

      ,save: function(){
        var self = this;
        $.ajax({
            url:'/-taddprofile',
            type:'post',
            data: { 
               pid: this.model.get('pid') + '~' + $('#feedpid').val()
              ,pname: $('#pname').val()
              ,parentpid: this.model.get('pid')
              ,feedurl: $('#feedurl').val()
             },
            success:function (data) {
              Backbone.history.navigate("profile/" + self.model.get('pid'), true);
            }
        });          
        return false;
      }
        
    });


    var BriefProfileView = Backbone.View.extend({
    
      initialize: function(options) {
       this.template = _.template($("#briefprofile-tmpl").html());
      }

      ,render:function () {
        $(this.el).html(this.template({'data': this.model.toJSON()}));
        return this;
      }
        
    });

    var BriefItemView = Backbone.View.extend({
    
      initialize: function(options) {
        this.template = _.template($("#briefitem-tmpl").html());
      }

      ,render:function () {
        $(this.el).html(this.template({'data': this.model.toJSON()}));
        return this;
      }
        
    });    

    var FollowingListView = Backbone.View.extend({
    
      initialize: function(options) {
        var self = this;
        this.template = _.template($("#following-tmpl").html());

        this._views = [];
     
        this.collection.each(function(m) {
          self._views.push(new BriefProfileView({
            model : m,
          }));
        });       
      }

      ,render:function () {
        var self = this;
        $(this.el).html(this.template({data:{'pid':this.collection.pid}}));
        // Render each sub-view and append it to the parent view's element.
        _(this._views).each(function(v) {
          $(self.el).append(v.render().el);
        })
        return this;
      }
        
    });

    var FollowersListView = Backbone.View.extend({
    
      initialize: function(options) {
        var self = this;
        this.template = _.template($("#followers-tmpl").html());

        this._views = [];
     
        this.collection.each(function(m) {
          self._views.push(new BriefProfileView({
            model : m,
          }));
        });       
      }

      ,render:function () {
        var self = this;
        $(this.el).html(this.template({data:{'pid':this.collection.pid}}));
        // Render each sub-view and append it to the parent view's element.
        _(this._views).each(function(v) {
          $(self.el).append(v.render().el);
        })
        return this;
      }
        
    });


    var FeedsListView = Backbone.View.extend({
    
      initialize: function(options) {
        var self = this;
        this.template = _.template($("#feeds-tmpl").html());

        this._views = [];
     
        this.collection.each(function(m) {
          self._views.push(new BriefFeedView({
            model : m,
          }));
        });       
      }

      ,render:function () {
        var self = this;
        $(this.el).html(this.template({data:{'pid':this.collection.pid}}));
        // Render each sub-view and append it to the parent view's element.
        _(this._views).each(function(v) {
          $(self.el).append(v.render().el);
        })
        return this;
      }
        
    });

    var BriefFeedView = Backbone.View.extend({
    
      initialize: function(options) {
       this.template = _.template($("#brieffeed-tmpl").html());
      }

      ,render:function () {
        $(this.el).html(this.template({'data': this.model.toJSON()}));
        return this;
      }
        
    });

    var AppRouter = Backbone.Router.extend({

        _currentView: null

        ,routes:{

             "profile/:pid":"profile"
            ,"following/:pid":"following"
            ,"followers/:pid":"followers"
            ,"feeds/:pid":"feeds"
            ,"editprofile/:pid":"editprofile"
            ,"addprofile":"addprofile"
            ,"addfeed/:pid":"addfeed"
            ,"*default":"main"

        }


        ,initialize:function() {
          session.set("ptsession", getCookie("ptsession"));
        }

        ,main:function () {
          var self = this;
          session.check( function() {
                            self.changePage(new MainView({ } ));
                          }, 
                          function() {
                            self.invalidSession();
                          } 
                        );
            
        }

        ,profile:function (pid) {
          var self = this;
          session.check( function() {

                            var profile = new Profile({'pid':pid});
                            profile.fetch({ 
                                success: function() { 

                                  var items = new ProfileItems({'pid':pid});
                                  items.fetch({ 
                                    success: function() { 
                                      if (profile.get("parentpid")) {
                                        self.changePage(new FeedView({model: profile, items: items} )); 
                                      } else {
                                        self.changePage(new ProfileView({model: profile, items: items} ));
                                      }
                                    },
                                    error: function() {
                                      self.changePage(new MainView({msg: "Problem retrieving profile items for '" + pid + "'" } ));
                                    } 
                                  });                                    
                                },
                                error: function() {
                                  self.changePage(new MainView({msg: "Problem retrieving profile '" + pid + "'" } ));
                                }
                            });

                            
                          }, 
                          function() {
                            self.invalidSession();
                          } 
                        );            
        }

        ,following:function (pid) {
          var self = this;
          session.check( function() {

                            var list = new FollowingList({'pid':pid});
                            list.fetch({ 
                                success: function() { 
                                  self.changePage(new FollowingListView({collection: list} )); 
                                },
                                error: function() {
                                  self.changePage(new MainView({msg: "Problem retrieving profile '" + pid + "'" } ));
                                }
                            });

                            
                          }, 
                          function() {
                            self.invalidSession();
                          } 
                        );            
        }

        ,followers:function (pid) {
          var self = this;
          session.check( function() {

                            var list = new FollowersList({'pid':pid});
                            list.fetch({ 
                                success: function() { 
                                  self.changePage(new FollowersListView({collection: list} )); 
                                },
                                error: function() {
                                  self.changePage(new MainView({msg: "Problem retrieving profile '" + pid + "'" } ));
                                }
                            });

                            
                          }, 
                          function() {
                            self.invalidSession();
                          } 
                        );            
        }

        ,feeds:function (pid) {
          var self = this;
          session.check( function() {

                            var list = new FeedsList({'pid':pid});
                            list.fetch({ 
                                success: function() { 
                                  self.changePage(new FeedsListView({collection: list} )); 
                                },
                                error: function() {
                                  self.changePage(new MainView({msg: "Problem retrieving profile '" + pid + "'" } ));
                                }
                            });

                            
                          }, 
                          function() {
                            self.invalidSession();
                          } 
                        );            
        }

        ,editprofile:function (pid) {
          var self = this;
          session.check( function() {

                            var profile = new Profile({'pid':pid});
                            profile.fetch({ 
                                success: function() { 
                                  if (profile.get("parentpid")) {
                                    self.changePage(new EditFeedView({model: profile} )); 
                                  } else {
                                    self.changePage(new EditProfileView({model: profile} )); 
                                  }
                                },
                                error: function() {
                                  self.changePage(new MainView({msg: "Problem retrieving profile '" + pid + "'" } ));
                                }
                            });

                            
                          }, 
                          function() {
                            self.invalidSession();
                          } 
                        );            
        }

        ,addprofile:function () {
          var self = this;
          session.check( function() {
              self.changePage(new AddProfileView({el:$('#content')} )); 
              }, 
              function() {
                self.invalidSession();
              } 
            );            
        }        
        ,addfeed:function (pid) {
          var self = this;
          session.check( function() {

                            var profile = new Profile({'pid':pid});
                            profile.fetch({ 
                                success: function() { 
                                  self.changePage(new AddFeedView({model: profile} )); 
                                },
                                error: function() {
                                  self.changePage(new MainView({msg: "Problem retrieving profile '" + pid + "'" } ));
                                }
                            });

                            
                          }, 
                          function() {
                            self.invalidSession();
                          } 
                        );            
        }        
        ,invalidSession: function() {
          self.changePage(new StaticView({name:"session"} )); 
        }
        ,changePage:function (view) {


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

    var session = new Session();

    var approute = new AppRouter();
    Backbone.history.start();

});