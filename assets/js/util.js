var Session = Backbone.Model.extend({

    check: function(successfn, failfn) {
        var self = this;
        self.set("ptsession", getCookie("ptsession"));
        pts = self.get("ptsession");
        if (pts) {
            $.ajax({
                url:"/-chksession"
                ,dataType:"json"
                ,success:function (data) {
                  self.set("pid", self.get("ptsession").split("|")[0]);

                  console.log("Valid session for pid: " +self.get("pid"));

                  successfn();

                }
                ,error:function (data) {
                  self.set("pid", null);
                  failfn(self);
                }
              });
        } else {
            failfn();
        }
    }



});
 
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

HELPERS

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

function hashCode(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; 
    }
    return hash;
}


function getCookie(c_name) {
 
  var i, x, y, ARRcookies = document.cookie.split(";");
    
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g,"");
    if (x === c_name) {
      return unescape(y);
    }
  }
}

function setCookie(c_name, value) {
  var exdate = new Date();
  exdate.setHours(exdate.getHours() + 1);
  var c_value = escape(value) + "; expires=" + exdate.toUTCString();
  document.cookie=c_name + "=" + c_value;
}


function displayValidationErrors (messages) {
    for (var key in messages) {
        if (messages.hasOwnProperty(key)) {
            console.log(messages[key]);
            addValidationError(key, messages[key]);
        }
    }
}

function addValidationError(field, message) {
    var controlGroup = $('#' + field).parent();
    controlGroup.addClass('error');
    $('.hint', controlGroup).html(message);
}

function removeValidationError(field) {
    var controlGroup = $('#' + field).parent();
    controlGroup.removeClass('error');
    $('.hint', controlGroup).html('');
}