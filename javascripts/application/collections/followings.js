Application.Collection.Followings = Backbone.Collection.extend({
    model: Application.Model.Profile,
    url: '/-jfollowing'
});