$(function(){

    // Disable jquery mobile routing so we can use backbone routing
    $(document).bind("mobileinit", function () {
        $.mobile.ajaxEnabled = false;
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;


      // Remove pages from the DOM when they are hidden (since we disabled jqm routing)
      $('div[data-role="page"]').live('pagehide', function (event, ui) {
        $(event.currentTarget).remove();
      });

    });

    /* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    HELPERS

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */

    function getCookie(c_name) {
     
      var i, x, y, ARRcookies = document.cookie.split(";");
        
      for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g,"");
        if (x === c_name) {
          return unescape(y);
        }
      }
    }
    
    function setCookie(c_name, value) {
      var exdate = new Date();
      exdate.setHours(exdate.getHours() + 1);
      var c_value = escape(value) + "; expires=" + exdate.toUTCString();
      document.cookie=c_name + "=" + c_value;
    }


    function displayValidationErrors (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                console.log(messages[key]);
                addValidationError(key, messages[key]);
            }
        }
    }
    
    function addValidationError(field, message) {
        var controlGroup = $('#' + field).parent();
        controlGroup.addClass('error');
        $('.hint', controlGroup).html(message);
    }

    function removeValidationError(field) {
        var controlGroup = $('#' + field).parent();
        controlGroup.removeClass('error');
        $('.hint', controlGroup).html('');
    }

    /* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    MODELS

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    var Item = Backbone.Model.extend({});
    var Session = Backbone.Model.extend({});



    var ItemList = Backbone.Collection.extend({
         model: Item
        ,order:'ts'
        ,status:'p'
        ,url: '/-jtl?pid=iand'


        ,refresh:function () {
            var url = '/-jtl?pid=iand&status=' + this.status + '&order=' + this.order;
            var self = this;
            $.ajax({
                url:url,
                dataType:"json",
                success:function (data) {
                    console.log("refresh retrieved " + data.length + " items");
                    self.reset(data);
                }
            });
        }


    });


    var Credentials = Backbone.Model.extend({

      defaults: {
          pid: null,
          pwd: null
      }
    
      ,url: "/-session"
    
      ,initialize: function () {
        this.validators = {};
        this.validators.pid = function (value) {
            return (value!==null && value.length!==0) ? {isValid: true} : {isValid: false, message: "Please enter your username."};
        };
        this.validators.pwd = function (value) {
            return (value!==null && value.length!==0) ? {isValid: true} : {isValid: false, message: "Please enter your password."};
        };
      }
    
      ,validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
      }
    
      ,validateAll: function () {
        var messages = {};
        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }
        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
      }
    });

  var RegistrationInfo = Backbone.Model.extend({

      defaults: {
           pid: null
          ,pwd: null
          ,name: null
      }
    
      ,url: "/-session"
    
      ,initialize: function () {
        this.validators = {};
        this.validators.pid = function (value) {
            return (value!==null && value.length!==0) ? {isValid: true} : {isValid: false, message: "Please enter your username."};
        };
        this.validators.pwd = function (value) {
            return (value!==null && value.length!==0) ? {isValid: true} : {isValid: false, message: "Please enter your password."};
        };
        this.validators.name = function (value) {
            return (value!==null && value.length!==0) ? {isValid: true} : {isValid: false, message: "Please enter your full name."};
        };
      }
    
      ,validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
      }
    
      ,validateAll: function () {
        var messages = {};
        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }
        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
      }
    });

    var ItemsView = Backbone.View.extend({
        el: "#itemlist"

        ,events:{
           'click .addbtn'           :  'promote'
          ,'click .followbtn'        :  'follow'
          ,'click #possiblebtn'      :  'possible'
          ,'click #maybebtn'         :  'maybe'
          ,'click #newbtn'           :  'newitem'
          ,'change #sorter'          :  'togglesort'
        }

        ,initialize:function () {
          var self = this;
          this.templateitem = _.template($("#item-template").html());
          this.templatefeature = _.template($("#item-template").html());
          this.listelem = $(".items", this.el);



          this.listelem.listview({
            autodividers: true

            ,autodividersSelector: function ( li ) {
              var out = li.data("date");
              return out;
            }

          });
          this.model.bind("reset", this.render, this);
        }

        ,render: function(eventName) {
          this.listelem.html('');
          var done = false;
          var self = this;

          _.each(this.model.models, function(item){
            if (done) {
              var lTemplate = this.templateitem(item.toJSON());
            } else {
              var lTemplate = this.templatefeature(item.toJSON());
              done = true;
            }
            console.log("Adding");
            self.listelem.append(lTemplate);
          }, this);

          this.listelem.listview('refresh');
          return this;
        }


        ,promote: function(e) {
          var clickedEl = $(e.currentTarget);
          var id = clickedEl.data("itemid");
          // alert("Promote item '" + id + "' to maybe list");
          var self = this;

          if (this.model.status == 'p') {
              var url = '/-tpromote';

          } else {
              var url = '/-tdemote';
          }


          $.ajax({
              url:url,
              type:'post',
              data: { pid: 'iand', id: id },
              success:function (data) {
                  console.log("posted to " + url);
                  self.model.refresh();
              }
          });          

        }

        ,follow: function(e) {
          var clickedEl = $(e.currentTarget);
          var pid = clickedEl.data("pid");
          alert("Follow user '" + pid + "'");
        }


        ,possible: function(e) {
          this.model.status = 'p';
          this.model.refresh();
        }


        ,maybe: function(e) {
          this.model.status = 'm';
          this.model.refresh();
        }

        ,newitem: function(e) {
          //alert("Add a new item");
        }


        ,togglesort: function(e) {
          var clickedEl = $("#sorter");
          this.model.order = clickedEl.val();
          this.model.refresh();
        }      
    });





    var LoginView = Backbone.View.extend({
      el: "#login"
    
      ,initialize: function(options) {
       this.template = _.template($("#login-template").html());
       this.render();
      }

      ,render:function () {
        $(this.el).html(this.template(this.model.toJSON())).trigger('create');
        return this;
      }
    
      ,events: {
        "change" : "change",
        "click .loginBtn" : "beforeLogin"
      }
    
      ,change: function (event) {
        
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        
        
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            addValidationError(target.id, check.message);
        } else {
            removeValidationError(target.id);
        }
      }
    
      ,beforeLogin: function(){
        var check = this.model.validateAll();
        if (check.isValid === false) {
          displayValidationErrors(check.messages);
          return false;
        } else {
          this.login();
        }
        return false;
      },
    
      login: function(){
      
          $.ajax({
              url:"/-session"
              ,type:'post'
              ,data: { pid: this.model.get('pid'), pwd: this.model.get('pwd') }
              ,success:function (data) {
                  console.log("Logged in successfully");
                  console.log("doing navigate");
                  Backbone.history.navigate("", true);
                  console.log("stopped navigate");
              }
              ,error: function (model, response, options) {
                console.log("Error thrown when logging in: " + response.responseText);
              }
          });  

      }
    
    });


    var RegisterView = Backbone.View.extend({
      el: "#register"
    
      ,initialize: function(options) {
       this.template = _.template($("#register-template").html());
       this.render();
      }

      ,render:function () {
        $(this.el).html(this.template(this.model.toJSON())).trigger('create');
        return this;
      }
    
      ,events: {
        "change" : "change",
        "click .submitBtn" : "beforeSubmit"
      }
    
      ,change: function (event) {
        
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        
        
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            addValidationError(target.id, check.message);
        } else {
            removeValidationError(target.id);
        }
      }
    
      ,beforeSubmit: function(){
        var check = this.model.validateAll();
        if (check.isValid === false) {
          displayValidationErrors(check.messages);
          return false;
        } else {
          this.submit();
        }
        return false;
      },
    
      submit: function(){
      
          $.ajax({
              url:"/-taddprofile"
              ,type:'post'
              ,data: { pid: this.model.get('pid'), pwd: this.model.get('pwd'), name: this.model.get('name') }
              ,success:function (data) {
                  console.log("Created profile successfully");
                  Backbone.history.navigate("", true);
              }
              ,error: function (model, response, options) {
                console.log("Error thrown when creating profile: " + response.responseText);
              }
          });  

      }
    
    });
  

    var AppRouter = Backbone.Router.extend({

        routes:{
             "login":"login"
            ,"register":"register"
            ,"*default":"timeline"
        }


        ,initialize:function() {
          this.session = new Session();
          this.session.set("ptsession", getCookie("ptsession"));
        }

        ,timeline:function () {
          console.log("Routed to timeline");
          var self = this;
          this.session.set("ptsession", getCookie("ptsession"));
          pts = this.session.get("ptsession");
          if (pts) {
            $.ajax({
                url:"/-chksession"
                ,dataType:"json"
                ,success:function (data) {
                  console.log("Valid session");
                  var items = new ItemList();
                  items.refresh();
                  self.changePage(new ItemsView({ model:items}));
                }
                ,error:function (data) {
                  console.log("Invalid session");
                  self.login();
                }
              });
            
          } else {
            this.login();
          }
        }

        ,login:function () {
          console.log("Routed to login");
          var self = this;
          this.session.set("ptsession", null);
          setCookie('ptsession', null);
          this.changePage(new LoginView({model: new Credentials()}));
        }

        ,register:function () {
          console.log("Routed to register");
          var self = this;
          this.session.set("ptsession", null);
          setCookie('ptsession', null);
          this.changePage(new RegisterView({model: new RegistrationInfo()} ));
        }        

        ,logout: function() {
          this.login();
        }

        ,changePage:function (page) {
            console.log("Changing page to " + $(page.el).attr('id'));
            //$(page.el).attr('data-role', 'page');
            page.render();
            //$('body').append($(page.el));
            $.mobile.changePage($(page.el), {
               changeHash: true
              ,transition: 'slide'
              ,reloadPage: true
            });
        }


    });

    var approute = new AppRouter();
    Backbone.history.start();

});