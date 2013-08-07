Handlebars.registerHelper('fromNow', function(value) {
    return moment.unix(
        value.toString().substr(0, 10)
    ).fromNow();
});

Handlebars.registerHelper('fromNowAdded', function(value) {
 
    if (moment().diff(moment(), moment.unix(value.toString().substr(0, 10)) ) < 3000) {
        return "just now";
    } else {
        return moment.unix(
            value.toString().substr(0, 10)
        ).fromNow();
    }
});