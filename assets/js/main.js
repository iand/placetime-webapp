$(function(){
    var Item = Backbone.Model.extend({});



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
                    console.log("refresh retrieved: " + data.length);
                    self.reset(data);
                }
            });
        }


    });


    var ItemsView = Backbone.View.extend({
         template: _.template($("#item-template").html())
        ,templatefeature: _.template($("#itemfeature-template").html())

        ,events:{
          'click .addbtn'           :  'promote',
          'click .followbtn'        :  'follow'
        }

        ,initialize:function () {
          var self = this;
          $(this.el).listview({
            autodividers: true

            ,autodividersSelector: function ( li ) {
              var out = li.data("date");
              return out;
            }

          });
          this.model.bind("reset", this.render, this);
        }

        ,render: function(eventName) {
          $(this.el).html('');
          var done = false;
          var self = this;

          _.each(this.model.models, function(item){
            if (done) {
              var lTemplate = this.template(item.toJSON());
            } else {
              var lTemplate = this.templatefeature(item.toJSON());
              done = true;
            }

            $(this.el).append(lTemplate);
          }, this);

          $(this.el).listview('refresh');
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

    });




    var items = new ItemList( { pid: 'iand', status:'p', order:'ts'} );
    



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
        var lItemsView = new ItemsView({el:'#items', model:items});
        var lHtml = lItemsView.render().el;

      }

      ,initialize: function(){
        var lOptions = {};
        lOptions.success = this.render;
        items.fetch(lOptions);
      }


      ,possible: function(e) {
        items.status = 'p';
        items.refresh();
      }


      ,maybe: function(e) {
        items.status = 'm';
        items.refresh();
      }

      ,newitem: function(e) {
        alert("Add a new item");
      }

      ,added: function(e) {
        items.order = 'ts';
        items.refresh();
      }

      ,calendar: function(e) {
        var clickedEl = $(e.currentTarget);
        if (items.order == 'ets') {
          $('span.ui-btn-text',clickedEl).text("Calendar");
          items.order = 'ts';
        } else {
          $('span.ui-btn-text',clickedEl).text("Added");
          items.order = 'ets';
        }
        clickedEl.trigger('refresh');
        items.refresh();
      }      

    });

    var App = new AppView;

});