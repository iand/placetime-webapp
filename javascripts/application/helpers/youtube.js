Handlebars.registerHelper('ifYoutube', function(value, options) {
    if ((/youtube\./).test(value) === true) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


Handlebars.registerHelper('getYoutubeUrl', function(value) {
    return 'http://www.youtube.com/embed/' + value.replace(
        /https?:\/\/(?:gdata\.|www\.)?youtube.com\/(?:feeds\/api\/videos\/|watch\?v=)/, ''
    );
});