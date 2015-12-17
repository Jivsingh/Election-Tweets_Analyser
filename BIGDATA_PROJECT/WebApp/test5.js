var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('c6e0f03b20fe21edf6a0dbfd1380f91fd82b157e');
//var text = 'A quarter of a million have signed the Trump petition. What a lovely democratic dilemma. Thanks all. https://t.co/IWE3CnSB04';
var google = require('google');

google.resultsPerPage = 1
var nextCounter = 0

google('hillary', function(err, next, links) {
    if (err) console.error(err)
    console.log("Total links: " + links.length);
    for (var i = 0; i < links.length; ++i) {
        //console.log(links[i].title + ' - ' + links[i].link) // link.href is an alias for link.link 
        if (links[i].link != null) {
        	var title = links[i].title.toString();
            var temp = links[i].link.toString();
            alchemy.sentiment(temp, {}, (err, result) => {
                //console.log(result.docSentiment);
                var sentiment = result.docSentiment;
                alchemy.concepts(temp, {}, function(err, response) {
                    if (err) throw err;

                    var points = [];
                    var concepts = response.concepts;

                    concepts.forEach(function(concept) {
                        points.push([concept.text]);
                    });
                    //console.log(points);
                    var temp_object = {
                    	title_link:title,
                    	link: temp,
                    	sentiment: sentiment.type,
                    	concepts:points
                    }
                    console.log(temp_object);
                    // Do something with data
                });
            });
        }

    }

    if (nextCounter < 1) {
        nextCounter += 1
        if (next) next()
    }
});
// alchemy.entities(text, {}, function(err, response) {
//   if (err) throw err;

//   // See http://www.alchemyapi.com/api/entity/htmlc.html for format of returned object
//   var entities = response.entities;
//   entities.forEach(function (entity) {
//   	//console.log(entity);
//   	alchemy.sentiment(entity.disambiguated.dbpedia, {}, (err, result) => {
//   		console.log(result);
//   	});
//   });

//   // Do something with data
// });
// alchemy.relations(text, {}, function(err, response) {
//   if (err) throw err;

//   // See http://www.alchemyapi.com/api/relation/htmlc.html for format of returned object
//   var relations = response.relations;
// console.log("2",response.relations);
//   // Do something with data
// });

// alchemy.keywords(text, {}, function(err, response) {
//   if (err) throw err;

//   // See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
//   var keywords = response.keywords;
//   console.log(response.keywords);
//   // Do something with data
// });

// alchemy.category(text, {}, function(err, response) {
//   if (err) throw err;

//   // See http://www.alchemyapi.com/api/categ/htmlc.html for format of returned object
//   var category = response.category;
//   console.log(response.category);
//   // Do something with data
// });



// alchemy.concepts(text, {}, function(err, response) {
//     if (err) throw err;

//     // See http://www.alchemyapi.com/api/concept/htmlc.html for format of returned object
//     var concepts = response.concepts;
//     console.log(concepts);
//     // Do something with data
// });
