Application.Model.Session = Backbone.Model.extend({
    check: function (successfn, failfn) {
        var self = this;
        self.set("ptsession", getCookie("ptsession"));
        pts = self.get("ptsession");

        if (pts) {
            $.ajax({
                url: "/-chksession",
                success: function (data) {
                    self.set("pid", self.get("ptsession").split("|")[0]);

                    console.log("Valid session for pid: " + self.get("pid"));

                    successfn(data);
                },
                error: function (data) {
                    self.set("pid", null);
                    failfn(data);
                }
            });
        } else {
            failfn();
        }
    },

    save: function (successfn, failfn) {
        var self = this;

        $.ajax({
            url: "/-session",
            type: 'post',
            data: {
                pid: self.get('pid'),
                pwd: self.get('pwd')
            },
            success: function (data) {
                console.log("Logged in successfully");
                self.set("pwd", null);

                successfn.call(self, data);
            },
            error: function (data) {
                console.log("Error thrown when logging in: " + response.responseText);
                self.set("pwd", null);

                failfn.call(self, data);
            }
        });
    }
});