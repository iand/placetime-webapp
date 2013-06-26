Handlebars.registerHelper('and', function(testA, testB, options) {
    if (testA && testB) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


Handlebars.registerHelper('or', function(testA, testB, options) {
    if (testA || testB) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


Handlebars.registerHelper('is', function(value, test, options) {
    if (value === test) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


Handlebars.registerHelper('isnt', function(value, test, options) {
    if (value !== test) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});