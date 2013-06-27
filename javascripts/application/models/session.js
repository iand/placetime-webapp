Application.Model.Session = Backbone.Model.extend({
    defaults: {
        pid: null
    },

    events: {
        'change': function() {

        }
    },


    initialize: function () {
        var cookie = $.cookie('ptsession');

        if (cookie !== undefined) {
            this.set('pid', cookie.split('|')[0]);
        }
    },


    check: function () {
        var self = this;

        var promise = $.ajax({
            url: '/-chksession'
        });

        promise.done(function () {
            var ptsession = $.cookie('ptsession');

            if (ptsession !== undefined) {
                self.set('pid', ptsession.split('|')[0]);
            }

            if ($.cookie('ptnewuser') === undefined || $.cookie('ptnewuser') === "null") {
                self.set('id', ptsession.split('|')[0]);
            }
        });

        promise.fail(function () {
            self.set('pid', null);
        });

        return promise;
    },



    save: function () {
        var self = this;

        var promise = $.ajax({
            url: '/-session',
            type: 'post',
            data: {
                pid: self.get('pid'),
                pwd: self.get('pwd')
            }
        });

        promise.done(function (data) {
            self.set('pwd', null);
            self.set('ptsession', $.cookie('ptsession'));
        });

        promise.fail(function (data) {
            self.set('pwd', null);
        });


        return promise;
    },



    destroy: function () {
        // TODO: Replace with XHR call
        $.cookie('ptsession', null);
    },



    location: function () {
        var promise = $.ajax({
            url: '/-jgeo',
            dataType: 'json'
        });

        return promise;
    }
});