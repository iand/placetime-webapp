Application.Model.Profile = Backbone.Model.extend({
    url: function() {
        return '/-jpr?pid=' + this.get('pid');
    }
});