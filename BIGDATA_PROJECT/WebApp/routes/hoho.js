'use strict';

var google = require('google');

google.resultsPerPage = 5
var nextCounter = 0

google('google', function(err, next, links) {
    if (err) console.error(err)
    console.log("Total links: " + links.length);
    for (var i = 0; i < links.length; ++i) {
        console.log(links[i].title + ' - ' + links[i].link) // link.href is an alias for link.link 
    }

    if (nextCounter < 4) {
        nextCounter += 1
        if (next) next()
    }
});
