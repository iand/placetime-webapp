function hashCode(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}


function displayValidationErrors (messages) {
    for (var key in messages) {
        if (messages.hasOwnProperty(key)) {
            console.log(messages[key]);
            addValidationError(key, messages[key]);
        }
    }
}

function addValidationError(field, message) {
    var controlGroup = $('#' + field).parent();
    controlGroup.addClass('error');
    $('.hint', controlGroup).html(message);
}

function removeValidationError(field) {
    var controlGroup = $('#' + field).parent();
    controlGroup.removeClass('error');
    $('.hint', controlGroup).html('');
}