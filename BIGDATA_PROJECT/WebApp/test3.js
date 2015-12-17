

var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'tweetmap.cpxe94ty4ohx.us-east-1.rds.amazonaws.com',
    user: 'joyeeta',
    password: 'tweetmap',
    database: 'tweets'
});
connection.connect(function(err) {
    if (err) console.log(err);
});
var keyword = "Hillary Clinton";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {
            		var str = rows[0].text.toLowerCase();
            	   for(var i = 1;i<rows.length;i++)
            	   {
            	   		str = str.concat(rows[i].text.toLowerCase());
            	   }  
            	   //console.log("Cat: ", str);
            	   tfidf.addDocument(str);
            }
           });
var keyword = "Donald Trump";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {
            		var str = rows[0].text.toLowerCase();
            	   for(var i = 1;i<rows.length;i++)
            	   {
            	   		str = str.concat(rows[i].text.toLowerCase());
            	   }  
            	   //console.log("Cat: ", str);
            	   tfidf.addDocument(str);
            }
           });
var keyword = "Bernie Sanders";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {
            		var str = rows[0].text.toLowerCase();
            	   for(var i = 1;i<rows.length;i++)
            	   {
            	   		str = str.concat(rows[i].text.toLowerCase());
            	   }  
            	   //console.log("Cat: ", str);
            	   tfidf.addDocument(str);
            }
           });

var keyword = "Ben Carson";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {
            		var str = rows[0].text.toLowerCase();
            	   for(var i = 1;i<rows.length;i++)
            	   {
            	   		str = str.concat(rows[i].text.toLowerCase());
            	   }  
            	   //console.log("Cat: ", str);
            	   tfidf.addDocument(str);
            }
           });
var keyword = "Ted Cruz";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {
            		var str = rows[0].text.toLowerCase();
            	   for(var i = 1;i<rows.length;i++)
            	   {
            	   		str = str.concat(rows[i].text.toLowerCase());
            	   }  
            	   //console.log("Cat: ", str);
            	   tfidf.addDocument(str);
            	   console.log('crazy --------------------------------');
tfidf.tfidfs('crazy', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
            }
           });



// tfidf.addDocument('this document is about node.');
// tfidf.addDocument('this document is about ruby.');
// tfidf.addDocument('this document is about ruby and node.');
// tfidf.addDocument('this document is about node. it has node examples');



// console.log('ruby --------------------------------');
// tfidf.tfidfs('ruby', function(i, measure) {
//     console.log('document #' + i + ' is ' + measure);
// });