Handlebars.registerHelper('fromNow', function(value) {
    return moment.unix(
        value.toString().substr(0, 10)
    ).fromNow();
});

Handlebars.registerHelper('fromNowAdded', function(value) {
 
    if ( moment.unix(value.toString().substr(0, 10)) > moment().unix()) {
        return "just now";
    } else {
        return moment.unix(
            value.toString().substr(0, 10)
        ).fromNow();
    }
});