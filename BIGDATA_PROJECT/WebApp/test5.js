var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('c6e0f03b20fe21edf6a0dbfd1380f91fd82b157e');
var text = 'A quarter of a million have signed the Trump petition. What a lovely democratic dilemma. Thanks all. https://t.co/IWE3CnSB04';
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



alchemy.concepts(text, {}, function(err, response) {
  if (err) throw err;

  // See http://www.alchemyapi.com/api/concept/htmlc.html for format of returned object
  var concepts = response.concepts;
console.log(concepts);
  // Do something with data
});