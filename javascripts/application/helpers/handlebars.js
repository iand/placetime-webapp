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



Handlebars.registerHelper('ifYoutube', function(value, options) {
    if ((/youtube\./).test(value) === true) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('getYoutubeUrl', function(value) {
    return 'http://www.youtube.com/embed/' + value.replace(
        'https://gdata.youtube.com/feeds/api/videos/', ''
    );
});



Handlebars.registerHelper('ifSpotify', function(value, options) {
    if ((/spotify\./).test(value) === true) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('getSpotifyUrl', function(value) {
    return 'https://embed.spotify.com/?uri=' + value;
});



Handlebars.registerHelper('ifHasEvent', function(value, options) {
    var model = new Application.Model.Item({
        event: value
    });

    if (model.hasEvent() === true) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


Handlebars.registerHelper('urlItem', function(value) {
    return window.location.origin + '/item/' + value;
});



Handlebars.registerHelper('fromNow', function(value) {
    return moment.unix(
        value.toString().substr(0, 10)
    ).fromNow();
});