this["JST"] = this["JST"] || {};

this["JST"]["follower"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <img src=\"";
  if (stack1 = helpers.profileimageurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.profileimageurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" width=\"40\" height=\"40\" />\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n        <img src=\"/-assets/images/user.png\" width=\"40\" height=\"40\" />\n    ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<p class=\"bio pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    ";
  if (stack1 = helpers.bio) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.bio; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</p>\n";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <span class=\"name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>:\n    ";
  return buffer;
  }

function program8(depth0,data) {
  
  
  return "\n<a class=\"button button-follow\">\n    <i class=\"icon-plus\"></i>\n</a>\n";
  }

  buffer += "<p class=\"sash followed\">\n    <span>\n        Followed\n        <i class=\"icon-plus\"></i>\n    </span>\n</p>\n<p class=\"sash flagged\">\n    <span>\n        Flagged\n        <i class=\"icon-flag\"></i>\n    </span>\n</p>\n\n<div class=\"icon icon-profile pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.profileimageurl, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<p class=\"username username-profile pull-left\">\n    <a href=\"#user/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        <i class=\"icon-flag flag\" title=\"Flag profile for spam\"></i>\n    </a>\n</p>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.bio, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ul class=\"statistics pull-left\">\n    <li class=\"followings\">\n        <a href=\"#followings/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.followingcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followingcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " following</a>\n    </li>\n    <li class='followers'>\n        <a href=\"#followers/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.followercount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followercount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " followers</a>\n    </li>\n</ul>\n\n";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  stack2 = ((stack1 = helpers.is || depth0.is),stack1 ? stack1.call(depth0, depth0.reciprocal, false, options) : helperMissing.call(depth0, "is", depth0.reciprocal, false, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["JST"]["followers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"scroller\">\n    <div class=\"collection-children\"></div>\n</div>";
  });

this["JST"]["following"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <img src=\"";
  if (stack1 = helpers.profileimageurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.profileimageurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" width=\"40\" height=\"40\" />\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n        <img src=\"/-assets/images/user.png\" width=\"40\" height=\"40\" />\n    ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<p class=\"bio pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    ";
  if (stack1 = helpers.bio) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.bio; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</p>\n";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <span class=\"name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>:\n    ";
  return buffer;
  }

function program8(depth0,data) {
  
  
  return "\n<a class=\"button button-unfollow\">\n    <i class=\"icon-minus\"></i>\n</a>\n";
  }

  buffer += "<p class=\"sash unfollowed\">\n    <span>\n        Unfollowed\n        <i class=\"icon-minus\"></i>\n    </span>\n</p>\n<p class=\"sash flagged\">\n    <span>\n        Flagged\n        <i class=\"icon-flag\"></i>\n    </span>\n</p>\n\n\n<div class=\"icon icon-profile pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.profileimageurl, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<p class=\"username username-profile pull-left\">\n    <a href=\"#user/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        <i class=\"icon-flag flag\" title=\"Flag profile for spam\"></i>\n    </a>\n</p>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.bio, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ul class=\"statistics pull-left\">\n    <li class=\"followings\">\n        <a href=\"#followings/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.followingcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followingcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " following</a>\n    </li>\n    <li class='followers'>\n        <a href=\"#followers/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.followercount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followercount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " followers</a>\n    </li>\n</ul>\n\n";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  stack2 = ((stack1 = helpers.is || depth0.is),stack1 ? stack1.call(depth0, ((stack1 = depth0.session),stack1 == null || stack1 === false ? stack1 : stack1.pid), depth0.user, options) : helperMissing.call(depth0, "is", ((stack1 = depth0.session),stack1 == null || stack1 === false ? stack1 : stack1.pid), depth0.user, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["JST"]["followings"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"scroller\">\n    <div class=\"collection-children\"></div>\n</div>";
  });

this["JST"]["header"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <ul class=\"navbar-nav pull-right\">\n        <li>\n            <a data-dropdown=\".navbar-dropdown\">\n                <i class=\"icon-cog\"></i>\n            </a>\n        </li>\n    </ul>\n\n    <div class=\"navbar-dropdown dropdown dropdown-tip dropdown-anchor-right\">\n        <ul class=\"dropdown-menu\">\n            <li>\n                <a href=\"#user\">\n                    <i class=\"icon-user\"></i>\n                    ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n                </a>\n            </li>\n            <li>\n                <a href=\"#logout\">\n                    <i class=\"icon-signout\"></i>\n                    Logout\n                </a>\n            </li>\n        </ul>\n    </div>\n    ";
  return buffer;
  }

  buffer += "<div class=\"navbar-inner layout-container-wide\">\n    <a class=\"navbar-brand pull-left\" href=\"/\">\n        <i class=\"icon-ok-circle\"></i>\n        <i class=\"icon-time\"></i>\n        placetime\n    </a>\n\n    <a class=\"navbar-tagline pull-left\" href=\"/\">a playlist for your life</a>\n\n    ";
  stack1 = helpers['if'].call(depth0, depth0.pid, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });

this["JST"]["item-add"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n                <% duration = getDuration(duration) %>\n                <ul class=\"item-add-duration duration\">\n                    ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.isnt || depth0.isnt),stack1 ? stack1.call(depth0, ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.days), 0, options) : helperMissing.call(depth0, "isnt", ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.days), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    <% if (duration.days !== 0 && duration.hours !== 0) { %>\n                    <li class=\"durationcolon\">:</li>\n                    <% } %>\n\n                    ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.isnt || depth0.isnt),stack1 ? stack1.call(depth0, ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.hours), 0, options) : helperMissing.call(depth0, "isnt", ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.hours), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    <% if (duration.hours !== 0 && duration.minutes !== 0) { %>\n                    <li class=\"durationcolon\">:</li>\n                    <% } %>\n\n                    ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  stack2 = ((stack1 = helpers.isnt || depth0.isnt),stack1 ? stack1.call(depth0, ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.minutes), 0, options) : helperMissing.call(depth0, "isnt", ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.minutes), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    <% if (duration.minutes !== 0 && duration.seconds !== 0) { %>\n                    <li class=\"durationcolon\">:</li>\n                    <% } %>\n\n                    ";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  stack2 = ((stack1 = helpers.isnt || depth0.isnt),stack1 ? stack1.call(depth0, ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.seconds), 0, options) : helperMissing.call(depth0, "isnt", ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.seconds), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                </ul>\n            ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <li class=\"days\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.days)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "d</li>\n                    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <li class=\"hours\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.hours)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "h</li>\n                    ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <li class=\"minutes\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.minutes)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "m</li>\n                    ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <li class=\"seconds\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.duration),stack1 == null || stack1 === false ? stack1 : stack1.seconds)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "s</li>\n                    ";
  return buffer;
  }

  buffer += "<form class=\"form item-add-form\">\n    <div class=\"field item-add-media\">\n        <label for=\"watch\">\n            <input type=\"radio\" name=\"media\" value=\"video\" id=\"watch\" checked=\"checked\">\n            Watch\n        </label>\n        <label for=\"listen\">\n            <input type=\"radio\" name=\"media\" value=\"audio\" id=\"listen\">\n            Listen\n        </label>\n        <label for=\"do\">\n            <input type=\"radio\" name=\"media\" value=\"event\" id=\"do\">\n            Do\n        </label>\n        <label for=\"read\">\n            <input type=\"radio\" name=\"media\" value=\"text\" id=\"read\">\n            Read\n        </label>\n    </div>\n\n    <div class=\"field item-add-title\">\n        <input type=\"text\" name=\"text\" placeholder=\"Title\" value=\"";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div class=\"field item-add-image\">\n        <div class=\"item-add-image-placeholder\">\n            <img src=\"/-assets/images/loading-image.gif\" height=\"16\" width=\"16\" />\n\n            ";
  stack1 = helpers['if'].call(depth0, depth0.duration, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n    </div>\n\n    <div class=\"field item-add-event\">\n        <label for=\"event\">\n            Add event or schedule date:\n            <input type=\"checkbox\" name=\"event\" id=\"event\">\n        </label>\n    </div>\n\n    <div class=\"field item-add-ets\">\n        <label for=\"ets\">Event Date</label>\n        <input type=\"date\" placeholder=\"dd/mm/yyyy\" min=\"1900-00-00\" name=\"ets\" value=\"";
  if (stack1 = helpers.ets) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ets; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div class=\"actions\">\n        <input type=\"hidden\" name=\"duration\" value=\"";
  if (stack1 = helpers.duration) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.duration; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n\n        <input type=\"submit\" value=\"Add\" class=\"item-add-btn-add\">\n        <input type=\"submit\" value=\"Cancel\" class=\"item-add-btn-cancel\">\n    </div>\n</form>";
  return buffer;
  });

this["JST"]["items"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"scroller\">\n    <div class=\"collection-children\"></div>\n</div>\n<div class=\"needle-view\"></div>";
  });

this["JST"]["loading"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>\n    <img alt=\"Loading\" src=\"/-assets/images/loading-items.gif\" height=\"16\" width=\"16\" />\n</p>";
  });

this["JST"]["login"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p class=\"login-twitter\">\n    <a href=\"/-twitter\" data-role=\"button\" rel=\"external\">\n        <i class=\"icon icon-twitter\"></i>\n        Sign in with Twitter\n    </a>\n</p>\n\n<p class=\"login-login\">\n    <a href=\"#login\">Or login / Sign up</a>\n</p>\n\n<form class=\"form login-form\">\n    <div class=\"form-field\">\n        <label for=\"name\">User name</label>\n        <input type=\"text\" name=\"pid\" id=\"pid\" value=\"\" required=\"required\">\n        <div class=\"form-hint\"></div>\n    </div>\n\n    <div class=\"form-field\">\n        <label for=\"name\">Password</label>\n        <input type=\"password\" name=\"pwd\" id=\"pwd\" value=\"\" required=\"required\">\n        <div class=\"form-hint\"></div>\n    </div>\n\n    <div class=\"form-error\"></div>\n\n    <input type=\"submit\" value=\"Login\" class=\"wide\">\n\n    <p class=\"login-register\">\n        <a href=\"#register\">Dont have an account? Sign Up</a>\n    </p>\n</form>";
  });

this["JST"]["needle-now"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"needle-date\">\n    <span class=\"needle-future pull-left\">\n        <i class=\"icon-arrow-up\"></i> Future\n    </span>\n    <span class=\"needle-now\">\n        Now\n        <i class=\"needle-icon-repeat icon-repeat\"></i>\n    </span>\n    <span class=\"needle-past pull-right\">\n       Past <i class=\"icon-arrow-down\"></i>\n    </span>\n</div>";
  });

this["JST"]["needle"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"needle-date\">\n    <span class=\"needle-value\"></span>\n    <i class=\"needle-icon-repeat icon-repeat\"></i>\n</div>";
  });

this["JST"]["no-results"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>\n    No more results\n</p>";
  });

this["JST"]["now"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n        My upcoming\n    ";
  }

function program3(depth0,data) {
  
  
  return "\n        Upcoming\n    ";
  }

function program5(depth0,data) {
  
  
  return "\n        My latest\n    ";
  }

function program7(depth0,data) {
  
  
  return "\n        Latest\n    ";
  }

  buffer += "<div class=\"now-separator-future\">\n    ";
  options = {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || depth0.is),stack1 ? stack1.call(depth0, depth0.status, "m", options) : helperMissing.call(depth0, "is", depth0.status, "m", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n\n<div class=\"now-separator-past\">\n    ";
  options = {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.is || depth0.is),stack1 ? stack1.call(depth0, depth0.status, "m", options) : helperMissing.call(depth0, "is", depth0.status, "m", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>";
  return buffer;
  });

this["JST"]["register"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h2 class=\"register-heading\">\n    <span>Register</span>\n</h2>\n\n<form class=\"form register-form\">\n    <div class=\"form-field\">\n        <label for=\"name\">User name</label>\n        <input type=\"text\" name=\"pid\" required=\"required\" pattern=\"[a-zA-Z0-9_]{1,15}\" maxlength=\"15\">\n    </div>\n\n    <div class=\"form-field\">\n        <label for=\"email\">Email address</label>\n        <input type=\"email\" name=\"email\" required=\"required\">\n    </div>\n\n    <div class=\"form-field\">\n        <label for=\"name\">Full name</label>\n        <input type=\"text\" name=\"name\" required=\"required\">\n    </div>\n\n    <div class=\"field\">\n        <label for=\"name\">Password</label>\n        <input type=\"password\" name=\"pwd\" required=\"required\">\n    </div>\n\n    <input class=\"wide\" type=\"submit\" value=\"Register\">\n</form>";
  });

this["JST"]["search-empty"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n    <span>Loading search results</span>\n    <img alt=\"Loading\" class=\"loading\" src=\"/-assets/images/vendor/jquery/fancybox/fancybox_loading.gif\" height=\"24\" width=\"24\" />\n";
  }

function program3(depth0,data) {
  
  
  return "\n    <span>No results</span>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.loading, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["JST"]["search-profile"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <img src=\"";
  if (stack1 = helpers.profileimageurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.profileimageurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" width=\"40\" height=\"40\" />\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n        <img src=\"/-assets/images/user.png\" width=\"40\" height=\"40\" />\n    ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<p class=\"bio pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    ";
  if (stack1 = helpers.bio) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.bio; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</p>\n";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <span class=\"name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>:\n    ";
  return buffer;
  }

  buffer += "<p class=\"sash followed\">\n    <span>\n        Followed\n        <i class=\"icon-plus\"></i>\n    </span>\n</p>\n<p class=\"sash flagged\">\n    <span>\n        Flagged\n        <i class=\"icon-flag\"></i>\n    </span>\n</p>\n\n<div class=\"icon icon-profile pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.profileimageurl, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<p class=\"username username-profile pull-left\">\n    <a href=\"#user/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n</p>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.bio, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ul class=\"statistics pull-left\">\n    <li class=\"followings\">\n        <a href=\"#followings/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.followingcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followingcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " following</a>\n    </li>\n    <li class='followers'>\n        <a href=\"#followers/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.followercount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followercount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " followers</a>\n    </li>\n</ul>\n\n<a class=\"button button-follow\">\n    <i class=\"icon-plus\"></i>\n</a>";
  return buffer;
  });

this["JST"]["searches"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"scroller\">\n    <div class=\"collection-children\"></div>\n</div>";
  });

this["JST"]["suggestion-empty"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n    <span>Loading suggestions</span>\n    <img alt=\"Loading\" class=\"loading\" src=\"/-assets/images/vendor/jquery/fancybox/fancybox_loading.gif\" height=\"24\" width=\"24\" />\n";
  }

function program3(depth0,data) {
  
  
  return "\n    <span>No suggestions</span>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.loading, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

this["JST"]["suggestion"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <img src=\"";
  if (stack1 = helpers.profileimageurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.profileimageurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" width=\"40\" height=\"40\" />\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n        <img src=\"/-assets/images/user.png\" width=\"40\" height=\"40\" />\n    ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<p class=\"bio pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    ";
  if (stack1 = helpers.bio) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.bio; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</p>\n";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <span class=\"name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>:\n    ";
  return buffer;
  }

  buffer += "<p class=\"sash followed\">\n    <span>\n        Followed\n        <i class=\"icon-plus\"></i>\n    </span>\n</p>\n<p class=\"sash flagged\">\n    <span>\n        Flagged\n        <i class=\"icon-flag\"></i>\n    </span>\n</p>\n\n<div class=\"icon icon-profile pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.profileimageurl, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n<p class=\"username username-profile pull-left\">\n    <a href=\"#user/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n</p>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.bio, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ul class=\"statistics pull-left\">\n    <li class=\"followings\">\n        <a href=\"#followings/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.followingcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followingcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " following</a>\n    </li>\n    <li class='followers'>\n        <a href=\"#followers/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.followercount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followercount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " followers</a>\n    </li>\n</ul>\n\n<a class=\"button button-follow\">\n    <i class=\"icon-plus\"></i>\n</a>";
  return buffer;
  });

this["JST"]["suggestions-template"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"scroller\">\n    <div class=\"collection-children\"></div>\n</div>";
  });

this["JST"]["suggestions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"scroller\">\n    <div class=\"collection-children\"></div>\n</div>";
  });

this["JST"]["timeline-private-header"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n<a class=\"now pull-right\">\n    now <i class=\"icon-now icon-repeat\"></i>\n</a>\n";
  }

  buffer += "<ul class=\"timeline-nav pull-left\">\n    <li class=\"items active first last\">\n        <a href=\"#timeline\" class=\"playlist\">My Playlist</a>\n    </li>\n</ul>\n\n<form class=\"form\">\n    <input class=\"pull-left url\" name=\"url\" type=\"url\" placeholder=\"http://www.domain.com/\" required=\"required\">\n    <input class=\"pull-left add\" name=\"submit\" type=\"submit\" value=\"Add\">\n</form>\n\n";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || depth0.is),stack1 ? stack1.call(depth0, depth0.view, "timeline", options) : helperMissing.call(depth0, "is", depth0.view, "timeline", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["JST"]["timeline-public-header"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "\n        <li class=\"timeline first active\">\n    ";
  }

function program3(depth0,data) {
  
  
  return "\n        <li class=\"timeline first\">\n    ";
  }

function program5(depth0,data) {
  
  
  return "\n        <li class=\"followings active\">\n    ";
  }

function program7(depth0,data) {
  
  
  return "\n        <li class=\"followings\">\n    ";
  }

function program9(depth0,data) {
  
  
  return "\n        <li class=\"followers last active\">\n    ";
  }

function program11(depth0,data) {
  
  
  return "\n        <li class=\"followers last\">\n    ";
  }

function program13(depth0,data) {
  
  
  return "\n            <option value=\"v\" selected=\"selected\">Watch</option>\n        ";
  }

function program15(depth0,data) {
  
  
  return "\n            <option value=\"v\">Watch</option>\n        ";
  }

function program17(depth0,data) {
  
  
  return "\n            <option value=\"a\" selected=\"selected\">Listen</option>\n        ";
  }

function program19(depth0,data) {
  
  
  return "\n            <option value=\"a\">Listen</option>\n        ";
  }

function program21(depth0,data) {
  
  
  return "\n            <option value=\"e\" selected=\"selected\">Do</option>\n        ";
  }

function program23(depth0,data) {
  
  
  return "\n            <option value=\"e\">Do</option>\n        ";
  }

function program25(depth0,data) {
  
  
  return "\n<a class=\"now pull-right\">\n    now <i class=\"icon-now icon-repeat\"></i>\n</a>\n";
  }

function program27(depth0,data) {
  
  
  return "\n<a class=\"back pull-right\" href=\"#timeline\">\n    back <i class=\"icon-back icon-arrow-left\"></i>\n</a>\n";
  }

  buffer += "<ul class=\"timeline-nav pull-left\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.view, "timeline", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <a href=\"#timeline\">Timeline</a>\n    </li>\n\n    ";
  stack1 = helpers['if'].call(depth0, depth0.view, "followings", {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <a href=\"#followings\">Following</a>\n    </li>\n\n    ";
  stack1 = helpers['if'].call(depth0, depth0.view, "followers", {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <a href=\"#followers\">Followers</a>\n    </li>\n</ul>\n\n\n<form class=\"form\">\n    <select class=\"pull-left type\" name=\"t\">\n        ";
  stack1 = helpers['if'].call(depth0, depth0.type, "v", {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.type, "a", {hash:{},inverse:self.program(19, program19, data),fn:self.program(17, program17, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.type, "e", {hash:{},inverse:self.program(23, program23, data),fn:self.program(21, program21, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n        <% if (view === 'followings' || view === 'followers') { %>\n            <option value=\"p\" selected=\"selected\">People</option>\n        <% } else if (type === 'p') { %>\n            <option value=\"p\" selected=\"selected\">People</option>\n        <% } else { %>\n            <option value=\"p\">People</option>\n        <% } %>\n    </select>\n\n    <input class=\"pull-left search\" name=\"s\" type=\"search\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.placeholders),stack1 == null || stack1 === false ? stack1 : stack1.type)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (stack2 = helpers.search) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.search; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" required=\"required\">\n</form>\n\n";
  stack2 = helpers['if'].call(depth0, depth0.view, "timeline", {hash:{},inverse:self.noop,fn:self.program(25, program25, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n";
  stack2 = helpers['if'].call(depth0, depth0.view, "search", {hash:{},inverse:self.noop,fn:self.program(27, program27, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["JST"]["timeline"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n<div class=\"timeline timeline-public\">\n";
  }

function program3(depth0,data) {
  
  
  return "\n<div class=\"timeline timeline-private\">\n";
  }

  options = {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.is || depth0.is),stack1 ? stack1.call(depth0, depth0.status, "p", options) : helperMissing.call(depth0, "is", depth0.status, "p", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    <div class=\"timeline-header\"></div>\n    <div class=\"timeline-collection\"></div>\n</div>";
  return buffer;
  });

this["JST"]["timelines"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"timeline-public\"></div>\n<div class=\"timeline-private\"></div>";
  });

this["JST"]["user-email"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h2>Email Address</h2>\n\n<form class=\"form\">\n    <div class=\"field\">\n        <label for=\"email\">Email</label>\n        <input type=\"email\" name=\"email\" id=\"email\" value=\"";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" required=\"required\">\n    </div>\n\n    <div class=\"field\">\n        <input type=\"submit\" value=\"Save\">\n    </div>\n</form>";
  return buffer;
  });

this["JST"]["user"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h2>Edit Profile</h2>\n\n<form class=\"form\">\n    <div class=\"field\">\n        <label for=\"name\">Name</label>\n        <input type=\"text\" name=\"name\" id=\"name\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div class=\"field\">\n        <label for=\"bio\">Bio</label>\n        <input type=\"text\" name=\"bio\" id=\"bio\" value=\"";
  if (stack1 = helpers.bio) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.bio; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div class=\"field\">\n        <label for=\"email\">Email</label>\n        <input type=\"email\" name=\"email\" id=\"email\" value=\"";
  if (stack1 = helpers.email) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.email; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" required=\"required\">\n    </div>\n\n    <div class=\"field\">\n        <h3>Services</h3>\n        <p>\n            Uncheck to opt out of seeing services in your timeline that you aren't registered for:\n        </p>\n\n        <label for=\"services[spotify]\">\n            Spotify\n            <input type=\"checkbox\" name=\"services[spotify]\" class=\"service\" checked=\"checked\">\n        </label>\n    </div>\n\n    <div class=\"field\">\n        <input type=\"submit\" value=\"Save\" class=\"save\">\n        <input type=\"submit\" value=\"Cancel\" class=\"cancel\">\n        <input type=\"submit\" value=\"Delete My Account\" class=\"destroy\">\n    </div>\n</form>";
  return buffer;
  });