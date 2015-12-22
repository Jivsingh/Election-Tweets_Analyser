var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('');
var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
    application_id: "",
    application_key: ""
});
var async = require("async");
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});
connection.connect(function(err) {
    if (err) console.log(err);
});

var strHillary;
var strDonald;
var strBernie;
var strBen;
var strTed;

var keyword = "Hillary Clinton";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
    if (error) {
        console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
    } else {
        strHillary = rows[0].text.toLowerCase();
        for (var i = 1; i < rows.length; i++) {
            strHillary = strHillary.concat(rows[i].text.toLowerCase());
        }
    }
});
var keyword = "Donald Trump";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
    if (error) {
        console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
    } else {
        strDonald = rows[0].text.toLowerCase();
        for (var i = 1; i < rows.length; i++) {
            strDonald = strDonald.concat(rows[i].text.toLowerCase());
        }

    }
});
var keyword = "Bernie Sanders";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
    if (error) {
        console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
    } else {
        strBernie = rows[0].text.toLowerCase();
        for (var i = 1; i < rows.length; i++) {
            strBernie = strBernie.concat(rows[i].text.toLowerCase());
        }
    }
});

var keyword = "Ben Carson";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
    if (error) {
        console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
    } else {
        strBen = rows[0].text.toLowerCase();
        for (var i = 1; i < rows.length; i++) {
            strBen = strBen.concat(rows[i].text.toLowerCase());
        }
    }
});
var keyword = "Ted Cruz";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
    if (error) {
        console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
    } else {
        strTed = rows[0].text.toLowerCase();
        for (var i = 1; i < rows.length; i++) {
            strTed = strTed.concat(rows[i].text.toLowerCase());
        }

        async.series([
            function(callback) {

                textapi.classifyByTaxonomy({
                    'text': strHillary,
                    'taxonomy': 'iab-qag'
                }, function(error, response) {
                    if (error === null) {
                        response['categories'].forEach(function(c) {
                            console.log("Hillary", c);
                        });

                    },
                    function(callback) {
                        textapi.classifyByTaxonomy({
                            'text': strDonald,
                            'taxonomy': 'iab-qag'
                        }, function(error, response) {
                            if (error === null) {
                                response['categories'].forEach(function(c) {
                                    console.log("Donald",c);
                                });
                            }
                        });

                    }
                ], function(error, results) {
                    console.log(result);

                });

        // console.log("FOR DONALD");


        // textapi.classifyByTaxonomy({
        //     'text': strHillary,
        //     'taxonomy': 'iab-qag'
        // }, function(error, response) {
        //     if (error === null) {
        //         response['categories'].forEach(function(c) {
        //             console.log(c);
        //         });
        //     }
        // });

    }
});
