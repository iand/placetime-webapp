$(function(){
    var Item = Backbone.Model.extend({});

    var ItemList = Backbone.Collection.extend({
        model: Item,
        url: '/-jtl?pid=iand',

    });


    var ItemsView = Backbone.View.extend({
        template: _.template($("#item-template").html()),
        templatefeature: _.template($("#itemfeature-template").html()),

        events:{
          'click .addbtn'        :  'promote',
          'click .followbtn'        :  'follow'
        },


        render: function(eventName) {

          var done = false;
          _.each(this.model.models, function(item){
            if (done) {
              var lTemplate = this.template(item.toJSON());
            } else {
              var lTemplate = this.templatefeature(item.toJSON());
              done = true;
            }

            $(this.el).append(lTemplate);
          }, this);
          return this;
        },


        promote: function(e) {
          var clickedEl = $(e.currentTarget);
          var id = clickedEl.data("itemid");
          alert("Promote item '" + id + "' to maybe list");

        },

        follow: function(e) {
          var clickedEl = $(e.currentTarget);
          var pid = clickedEl.data("pid");
          alert("Follow user '" + pid + "'");
        }

    });




    items = new ItemList();
    

    var AppView = Backbone.View.extend({
      el: "body"


      ,events:{
           'click #possiblebtn'        :  'possible'
          ,'click #maybebtn'           :  'maybe'
          ,'click #newbtn'             :  'newitem'
          ,'click #addedbtn'           :  'added'
          ,'click #calendarbtn'        :  'calendar'
      }

      ,render: function(){
        var lItemsView = new ItemsView({model:items});
        var lHtml = lItemsView.render().el;
        $('#items').html(lHtml);
      }

      ,initialize: function(){
        var lOptions = {};
        lOptions.success = this.render;
        items.fetch(lOptions);
      }


      ,possible: function(e) {
        alert("View possible items");
      }


      ,maybe: function(e) {
        alert("View maybe items");
      }

      ,newitem: function(e) {
        alert("Add a new item");
      }

      ,added: function(e) {
        alert("Sort by date added");
      }

      ,calendar: function(e) {
        alert("Sort by event date");
      }      

    });

    var App = new AppView;

});