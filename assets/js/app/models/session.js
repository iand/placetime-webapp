Application.Model.Session = Backbone.Model.extend({
    check: function (successfn, failfn) {
        var self = this;
        self.set("ptsession", getCookie("ptsession"));
        pts = self.get("ptsession");
        if (pts) {
            $.ajax({
                url: "/-chksession",
                dataType: "json",
                success: function (data) {
                    self.set("pid", self.get("ptsession").split("|")[0]);

                    console.log("Valid session for pid: " + self.get("pid"));

                    successfn();

                },
                error: function (data) {
                    self.set("pid", null);
                    failfn(self);
                }
            });
        } else {
            failfn();
        }
    }
});