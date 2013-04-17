Application.Model.Session = Backbone.Model.extend({
    initialize: function () {
        var cookie = $.cookie('ptsession');

        if (cookie !== undefined) {
            this.set('pid', cookie.split('|')[0]);
        }
    },


    check: function (done, fail) {
        var self = this;


        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);


        if (this.get('ptsession')) {
            $.ajax({
                url: '/-chksession'
            })
            .done(function () {
                var cookie = $.cookie('ptsession');

                if (cookie !== undefined) {
                    self.set('pid', cookie.split('|')[0]);
                }

                defer.resolve();
            })
            .fail(function () {
                self.set('pid', null);
                defer.reject();
            });
        } else {
            defer.reject();
        }


        return defer.promise();
    },



    save: function (done, fail) {
        var self = this;


        var defer = $.Deferred();

        defer.done(done);
        defer.fail(fail);

        $.ajax({
            url: '/-session',
            type: 'post',
            data: {
                pid: self.get('pid'),
                pwd: self.get('pwd')
            }
        })
        .done(function (data) {
            self.set('pwd', null);
            self.set('ptsession', $.cookie('ptsession'));

            defer.resolve(data);
        })
        .fail(function (data) {
            self.set('pwd', null);

            defer.fail(data);
        });


        return defer.promise();
    },



    destroy: function () {
        // TODO: Replace with XHR call
        $.cookie('ptsession', null);

        Backbone.Model.prototype.destroy.apply(this);
    }
});