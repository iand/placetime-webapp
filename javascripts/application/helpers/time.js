Handlebars.registerHelper('fromNow', function(value) {
    return moment.unix(
        value.toString().substr(0, 10)
    ).fromNow();
});