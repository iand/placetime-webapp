this["JST"] = this["JST"] || {};

this["JST"]["followers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"scroller\">\n    <div class=\"collection-children\"></div>\n</div>";
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

this["JST"]["items"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"scroller\">\n    <div class=\"collection-children\"></div>\n</div>\n<div class=\"needle-view\"></div>";
  });

this["JST"]["load-more"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>\n    Load more\n</p>";
  });

this["JST"]["loading"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<img alt=\"Loading\" src=\"/-assets/images/loading-items.gif\" height=\"16\" width=\"16\" />";
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
  
  
  return "\n        Upcoming items\n    ";
  }

function program5(depth0,data) {
  
  
  return "\n        My latest\n    ";
  }

function program7(depth0,data) {
  
  
  return "\n        Latest items\n    ";
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
  
  
  return "\n        <img src=\"<%= profileimageurl %>\" width=\"40\" height=\"40\" />\n    ";
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
  buffer += "\n</div>\n\n<p class=\"username username-profile pull-left\">\n    <a href=\"#user/<%= encodeURI(pid) %>\">\n        ";
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
  
  
  return "\n    <span>Loading search results</span>\n    <img alt=\"Loading\" class=\"loading\" src=\"/-assets/images/vendor/jquery/fancybox/fancybox_loading.gif\" height=\"24\" width=\"24\" />\n";
  }

function program3(depth0,data) {
  
  
  return "\n    <span>No results</span>\n";
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
  buffer += "\n</div>\n\n<p class=\"username username-profile pull-left\">\n    <a href=\"#user/<%= encodeURI(pid) %>\">\n        ";
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