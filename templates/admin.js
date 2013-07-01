this["JST"] = this["JST"] || {};

this["JST"]["back"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a href=\"/-admin\">\n    <i class=\"icon-arrow-left back-icon\"></i>\n    Back to admin page\n</a>";
  });

this["JST"]["feed-brief"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href=\"#/profile/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " (@";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ")\n</a>\n: ";
  if (stack1 = helpers.feedurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feedurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  });

this["JST"]["feed-edit"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>Edit Feed</h3>\n<form action=\"\" method=\"post\">\n    <div>\n        <label for=\"name\">Name </label>\n        <input type=\"text\" name=\"name\" id=\"name\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div>\n        <label for=\"parentpid\">Parent profile id </label>\n        <input type=\"text\" name=\"parentpid\" id=\"parentpid\" value=\"";
  if (stack1 = helpers.parentpid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentpid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div>\n        <label for=\"feedurl\">Feed URL </label>\n        <input type=\"text\" name=\"feedurl\" id=\"feedurl\" value=\"";
  if (stack1 = helpers.feedurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feedurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div>\n        <input type=\"submit\" value=\"Save\" class=\"saveBtn\">\n        <a href=\"#profile/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">cancel</a>\n    </div>\n</form>";
  return buffer;
  });

this["JST"]["feed"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>Manage Feed</h3>\n\n<dl>\n    <dt>Profile:</dt>\n    <dd>";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Name:</dt>\n    <dd>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Items in feed:</dt>\n    <dd>";
  if (stack1 = helpers.mcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.mcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Followers:</dt>\n    <dd>\n        <a href=\"#followers/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n            ";
  if (stack1 = helpers.followercount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followercount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </a>\n    </dd>\n\n    <dt>Parent profile:</dt>\n    <dd>\n        <a href=\"#profile/";
  if (stack1 = helpers.parentpid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentpid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n            ";
  if (stack1 = helpers.parentpid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentpid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </a>\n    </dd>\n\n    <dt>Feed URL:</dt>\n    <dd>";
  if (stack1 = helpers.feedurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feedurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n</dl>\n\n\n<div class=\"items\">\n    <h3>Items</h3>\n</div>\n\n\n<button class=\"editBtn\">Edit Feed</button>\n<button class=\"deleteBtn\">Delete Feed</button>\n<button class=\"refreshBtn\">Refresh Feed</button>";
  return buffer;
  });

this["JST"]["feeds"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>Feeds for ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>";
  return buffer;
  });

this["JST"]["followers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>Profiles Following ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>";
  return buffer;
  });

this["JST"]["followings"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>Profiles Followed by ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>";
  return buffer;
  });

this["JST"]["header"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "\n    <ul class=\"navbar-nav pull-right\">\n        <li>\n            <a data-dropdown=\".navbar-dropdown\">\n                <i class=\"icon-cog\"></i>\n            </a>\n        </li>\n    </ul>\n    ";
  }

  buffer += "<div class=\"navbar-inner layout-container\">\n    <a class=\"navbar-brand pull-left\" href=\"/\">\n        <i class=\"icon-ok-circle\"></i>\n        <i class=\"icon-time\"></i>\n        placetime\n    </a>\n\n    <a class=\"navbar-tagline pull-left\" href=\"/\">a playlist for your life</a>\n\n    ";
  stack1 = helpers['if'].call(depth0, depth0.pid, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    <div class=\"navbar-dropdown dropdown dropdown-tip dropdown-anchor-right\">\n        <ul class=\"dropdown-menu\">\n            <li>\n                <a class=\"main-hiddenlink\" href=\"#new\">\n                    <i class=\"icon-edit\"></i>\n                    new\n                </a>\n            </li>\n            <li>\n                <a class=\"main-hiddenlink\" href=\"#profile\">\n                    <i class=\"icon-user\"></i>\n                    ";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n                </a>\n            </li>\n            <li>\n                <a class=\"main-hiddenlink\" href=\"#logout\">\n                    <i class=\"icon-signout\"></i>\n                    logout\n                </a>\n            </li>\n        </ul>\n    </div>\n</div>";
  return buffer;
  });

this["JST"]["home"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"message\">";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n";
  return buffer;
  }

  buffer += "<h1>Placetime Admin</h1>\n";
  stack1 = helpers['if'].call(depth0, depth0.message, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<form action=\"#profile\" method=\"post\">\n    <label for=\"pid\">User profile</label>\n\n    <input type=\"text\" name=\"pid\" size=\"20\" value=\"\">\n    <input type=\"submit\" value=\"Manage Profile\">\n</form>\n\n<div><a href=\"#profile/new\">New profile</a></div>";
  return buffer;
  });

this["JST"]["item-brief"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  if (stack1 = helpers.ets) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ets; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    ";
  return buffer;
  }

  buffer += "<a href=\"";
  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n\n    ";
  stack1 = helpers['if'].call(depth0, depth0.ets, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</a>";
  return buffer;
  });

this["JST"]["profile-brief"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n    <a href=\"#/profile/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " (@";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ")\n    </a>\n</div>";
  return buffer;
  });

this["JST"]["profile-edit"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>Edit Profile</h3>\n\n<form action=\"\" method=\"post\">\n    <div>\n        <label for=\"name\">Name </label>\n        <input type=\"text\" name=\"name\" id=\"name\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div>\n        <label for=\"bio\">Bio </label>\n        <input type=\"text\" name=\"bio\" id=\"bio\" value=\"";
  if (stack1 = helpers.bio) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.bio; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n\n    <div>\n        <input type=\"submit\" value=\"Save\">\n        <a href=\"#profile/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">cancel</a>\n    </div>\n</form>";
  return buffer;
  });

this["JST"]["profile-new"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h3>New Profile</h3>\n<form action=\"\" method=\"post\">\n    <div>\n        <label for=\"pid\">Profile ID </label>\n        <input type=\"text\" name=\"pid\" id=\"pid\" value=\"\">\n    </div>\n\n    <div>\n        <label for=\"name\">Name </label>\n        <input type=\"text\" name=\"name\" id=\"name\" value=\"\">\n    </div>\n\n    <div>\n        <label for=\"pwd\">Password </label>\n        <input type=\"text\" name=\"pwd\" id=\"pwd\" value=\"\">\n    </div>\n\n    <div>\n        <label for=\"bio\">Bio </label>\n        <input type=\"text\" name=\"bio\" id=\"bio\" value=\"\">\n    </div>\n\n    <div>\n        <input type=\"submit\" value=\"Save\" class=\"saveBtn\">\n        <a href=\"#home\">cancel</a>\n    </div>\n</form>";
  });

this["JST"]["profile-view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div>\n        Parent profile:\n        <a href=\"#profile/";
  if (stack1 = helpers.parentpid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentpid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n            ";
  if (stack1 = helpers.parentpid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentpid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </a>\n    </div>\n    <div>\n        Feed URL: ";
  if (stack1 = helpers.feedurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feedurl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </div>\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div>\n        Feeds:\n        <a href=\"#feeds/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n            ";
  if (stack1 = helpers.feedcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feedcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </a>\n    </div>\n";
  return buffer;
  }

  buffer += "<h3>Manage Profile</h3>\n<dl>\n    <dt>Profile:</dt>\n    <dd>";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Name:</dt>\n    <dd>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Bio:</dt>\n    <dd>";
  if (stack1 = helpers.bio) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.bio; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Date joined:</dt>\n    <dd>";
  if (stack1 = helpers.joined) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.joined; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Followed items:</dt>\n    <dd>";
  if (stack1 = helpers.pcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Bookmarked items:</dt>\n    <dd>";
  if (stack1 = helpers.mcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.mcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</dd>\n\n    <dt>Following:</dt>\n    <dd>\n        <a href=\"#following/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n            ";
  if (stack1 = helpers.followingcount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followingcount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </a>\n    </dd>\n\n    <dt>Followers:</dt>\n    <dd>\n    <a href=\"#followers/";
  if (stack1 = helpers.pid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.pid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        ";
  if (stack1 = helpers.followercount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.followercount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n    </dd>\n</dl>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.parentpid, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n<div class=\"profile-items\">\n    <h3>Items</h3>\n</div>\n\n\n<button class=\"profile-edit\">Edit Profile</button>\n<button class=\"profile-add\">Add Feed</button>";
  return buffer;
  });