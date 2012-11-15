$(function(){
    var Item = Backbone.Model.extend({});

    var ItemList = Backbone.Collection.extend({
        model: Item,
        url: '/-jtl?pid=iand',

    });


    var ItemsView = Backbone.View.extend({
        template: _.template($("#item-template").html()),
        templatefeature: _.template($("#itemfeature-template").html()),


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
        }

    });


    items = new ItemList();
    

    var AppView = Backbone.View.extend({
      el: "body",

      render: function(){
        var lItemsView = new ItemsView({model:items});
        var lHtml = lItemsView.render().el;
        $('#items').html(lHtml);
      },

      initialize: function(){
        var lOptions = {};
        lOptions.success = this.render;
        items.fetch(lOptions);
      }
    });

    var App = new AppView;

});