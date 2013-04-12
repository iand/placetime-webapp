Application.Collection.Followers = Backbone.Collection.extend({
    model: Application.Model.Profile,
    url: '/-jfollowers'
});