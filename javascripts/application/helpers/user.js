Handlebars.registerHelper('ifSystemUser', function(value, options) {
    var pids = [
        'youtube',
        'spotify',
        'eventful'
    ];

    if (pids.indexOf(value) !== -1) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});