(function() {
    var src  = 'http://www.placetime.com/-assets/javascripts/bookmarklet.js';
        src += '?' + (new Date()).getTime();

    var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;

    document.body.appendChild(script);
})();