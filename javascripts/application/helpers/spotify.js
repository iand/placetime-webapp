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