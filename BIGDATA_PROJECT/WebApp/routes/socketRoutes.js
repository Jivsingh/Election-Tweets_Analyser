var mysql = require('mysql');
var socketList = [];
var connection = mysql.createConnection({
    host: 'tweetmap.cpxe94ty4ohx.us-east-1.rds.amazonaws.com',
    user: 'joyeeta',
    password: 'tweetmap',
    database: 'tweets'
});
var HashMap = require('hashmap');
connection.connect(function(err) {
    if (err) console.log(err);
});

var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

module.exports = function(io) {

    io.on('connection', function(socket) {
        socketList.push(socket);
        socket.emit('connectionSuccessful', "Connection Successful");
        var queryString = 'SELECT * FROM Politics_2';
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {
                //console.log(rows);
                socket.emit('tweetsfromDB', rows);
            }
        });
         var queryString2 = "SELECT * FROM Politics_3";
            connection.query(queryString2, function(error, rows) {
                if (error) {
                    console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
                } else {
                    var map = new HashMap();
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].hashtags != "[]") {
                            var temps = JSON.parse(rows[i].hashtags);
                            temps.forEach(function(temp) {
                                if (map.has(temp.text.toLowerCase())) {
                                    map.set(temp.text.toLowerCase(), map.get(temp.text.toLowerCase()) + 1);
                                } else {
                                    map.set(temp.text.toLowerCase(), 1);
                                }
                            });
                        }
                    }
                    var data = [];
                    map.forEach(function(value, key) {
                        data.push([key, value]);
                    });
                    data.sort(function(a, b) {
                        return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0
                    });
                    var points = [];
                    for (var i = 0; i < data.length; i++) {
                        var str1 = "#";
                        if (data[i][1] > 12) {
                            points.push({
                                "text": str1.concat(data[i][0]),
                                "size": 3 * data[i][1]
                            });
                        } else if (data[i][1] > 1 && data[i][1] < 12) {
                            points.push({
                                "text": str1.concat(data[i][0]),
                                "size": 6 * data[i][1]
                            });
                        }

                    }
                    console.log(points);
                    socket.emit('HashTags', points);
                }
            });
        var queryString1 = "SELECT * FROM Politics_3";
        connection.query(queryString1, function(error, rows) {
            if (error) {
                console.log(error);
            } else {

                var very_light_users = 0;
                var light_users = 0;
                var medium_users = 0;
                var heavy_users = 0;
                var positive = 0;
                var negative = 0;
                var neutral = 0;
                var total = 0;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].status_count_user < 100)
                        very_light_users++;
                    else if (rows[i].status_count_user > 100 && rows[i].status_count_user < 2500)
                        light_users++;
                    else if (rows[i].status_count_user > 2500 && rows[i].status_count_user < 10000)
                        medium_users++;
                    else if (rows[i].status_count_user > 10000)
                        heavy_users++;
                    if (JSON.parse(rows[i].sentiment) != null) {
                        if (JSON.parse(rows[i].sentiment).type == "positive")
                            positive++;
                        else if (JSON.parse(rows[i].sentiment).type == "negative")
                            negative++;
                        else if (JSON.parse(rows[i].sentiment).type == "neutral")
                            neutral++;
                        total++;
                    }

                }
                console.log(very_light_users, ",", light_users, ",", medium_users, ",", heavy_users, ",", rows.length);
                console.log((very_light_users / rows.length) * 100, (light_users / rows.length) * 100, (medium_users / rows.length) * 100, (heavy_users / rows.length) * 100);
                console.log(positive, negative, neutral, total);
                console.log((positive / total) * 100, (negative / total) * 100, (neutral / total) * 100);
                var temp = {
                    average_very_light: (very_light_users / rows.length) * 100,
                    average_light: (light_users / rows.length) * 100,
                    average_medium: (medium_users / rows.length) * 100,
                    average_heavy: (heavy_users / rows.length) * 100,
                    average_sentiment_positive: (positive / total) * 100,
                    average_sentiment_negative: (negative / total) * 100,
                    average_sentiment_neutral: (neutral / total) * 100,
                    very_light: very_light_users,
                    light: light_users,
                    medium: medium_users,
                    heavy: heavy_users,
                    positive_key: positive,
                    negative_key: negative,
                    neutral_key: neutral
                };
                socket.emit('Sentiment_Users_No', temp);

            }
        });
        var confusion_matrix = new Array();

        for (i = 0; i < 5; i++) {
            confusion_matrix[i] = new Array();
            for (j = 0; j < 5; j++) {
                confusion_matrix[i][j] = 0;
            }
        }

        var keyword = "Hillary Clinton";
        var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {

                var total = rows.length;
                var relation_hillary_bernie = 0;
                var relation_hillary_ted = 0;
                var relation_hillary_trump = 0;
                var relation_hillary_ben = 0;
                for (var i = 0; i < rows.length; i++) {

                    var temp = rows[i];
                    if (temp.text.toLowerCase().indexOf("bernie") > -1 || temp.text.toLowerCase().indexOf("sanders") > -1) {

                        relation_hillary_bernie++;
                    }
                    if (temp.text.toLowerCase().indexOf("ted") > -1 || temp.text.toLowerCase().indexOf("cruz") > -1) {
                        relation_hillary_ted++;
                    }
                    if (temp.text.toLowerCase().indexOf("trump") > -1 || temp.text.toLowerCase().indexOf("donald") > -1) {

                        relation_hillary_trump++;
                    }
                    if (temp.text.toLowerCase().indexOf("ben") > -1 || temp.text.toLowerCase().indexOf("carson") > -1) {
                        relation_hillary_ben++;
                    }
                }

                console.log(relation_hillary_bernie, relation_hillary_ted, relation_hillary_trump, relation_hillary_ben, total);
                confusion_matrix[1][0] = relation_hillary_trump;
                confusion_matrix[1][1] = total;
                confusion_matrix[1][2] = relation_hillary_bernie;
                confusion_matrix[1][3] = relation_hillary_ben;
                confusion_matrix[1][4] = relation_hillary_ted;
            }
        });
        var keyword = "Donald Trump";
        var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {

                var relation_trump_bernie = 0;
                var relation_trump_ted = 0;
                var relation_trump_hillary = 0;
                var relation_trump_ben = 0;
                var total = rows.length;
                for (var i = 0; i < rows.length; i++) {

                    var temp = rows[i];
                    if (temp.text.toLowerCase().indexOf("bernie") > -1 || temp.text.toLowerCase().indexOf("sanders") > -1) {

                        relation_trump_bernie++;
                    }
                    if (temp.text.toLowerCase().indexOf("ted") > -1 || temp.text.toLowerCase().indexOf("cruz") > -1) {

                        relation_trump_ted++;
                    }
                    if (temp.text.toLowerCase().indexOf("hillary") > -1 || temp.text.toLowerCase().indexOf("clinton") > -1) {

                        relation_trump_hillary++;
                    }
                    if (temp.text.toLowerCase().indexOf("ben") > -1 || temp.text.toLowerCase().indexOf("carson") > -1) {

                        relation_trump_ben++;
                    }

                }

                console.log(relation_trump_bernie, relation_trump_ted, relation_trump_hillary, relation_trump_ben, total);
                confusion_matrix[0][0] = total;
                confusion_matrix[0][1] = relation_trump_hillary;
                confusion_matrix[0][2] = relation_trump_bernie;
                confusion_matrix[0][3] = relation_trump_ben;
                confusion_matrix[0][4] = relation_trump_ted;
            }
        });
        var keyword = "Bernie Sanders";
        var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {

                var relation_bernie_hillary = 0;
                var relation_bernie_trump = 0;
                var relation_bernie_ted = 0;
                var relation_bernie_ben = 0;
                var total = rows.length;
                for (var i = 0; i < rows.length; i++) {

                    var temp = rows[i];
                    if (temp.text.toLowerCase().indexOf("trump") > -1 || temp.text.toLowerCase().indexOf("donald") > -1) {

                        relation_bernie_trump++;
                    }
                    if (temp.text.toLowerCase().indexOf("ted") > -1 || temp.text.toLowerCase().indexOf("cruz") > -1) {

                        relation_bernie_ted++;
                    }
                    if (temp.text.toLowerCase().indexOf("hillary") > -1 || temp.text.toLowerCase().indexOf("clinton") > -1) {

                        relation_bernie_hillary++;
                    }
                    if (temp.text.toLowerCase().indexOf("ben") > -1 || temp.text.toLowerCase().indexOf("carson") > -1) {

                        relation_bernie_ben++;
                    }
                }

                console.log(relation_bernie_trump, relation_bernie_ted, relation_bernie_hillary, relation_bernie_ben, total);
                confusion_matrix[2][0] = relation_bernie_trump;
                confusion_matrix[2][1] = relation_bernie_hillary;
                confusion_matrix[2][2] = total;
                confusion_matrix[2][3] = relation_bernie_ben;
                confusion_matrix[2][4] = relation_bernie_ted;
            }
        });

        var keyword = "Ben Carson";
        var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {

                var relation_ben_hillary = 0;
                var relation_ben_trump = 0;
                var relation_ben_ted = 0;
                var relation_ben_bernie = 0;
                var total = rows.length;
                for (var i = 0; i < rows.length; i++) {

                    var temp = rows[i];
                    if (temp.text.toLowerCase().indexOf("trump") > -1 || temp.text.toLowerCase().indexOf("donald") > -1) {

                        relation_ben_trump++;
                    }
                    if (temp.text.toLowerCase().indexOf("ted") > -1 || temp.text.toLowerCase().indexOf("cruz") > -1) {

                        relation_ben_ted++;
                    }
                    if (temp.text.toLowerCase().indexOf("hillary") > -1 || temp.text.toLowerCase().indexOf("clinton") > -1) {

                        relation_ben_hillary++;
                    }
                    if (temp.text.toLowerCase().indexOf("bernie") > -1 || temp.text.toLowerCase().indexOf("sanders") > -1) {

                        relation_ben_bernie++;
                    }
                }
                console.log(relation_ben_trump, relation_ben_ted, relation_ben_hillary, relation_ben_bernie, total);
                confusion_matrix[3][0] = relation_ben_trump;
                confusion_matrix[3][1] = relation_ben_hillary;
                confusion_matrix[3][2] = relation_ben_bernie;
                confusion_matrix[3][3] = total;
                confusion_matrix[3][4] = relation_ben_ted;
            }
        });

        var keyword = "Ted Cruz";
        var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {

                var relation_ted_hillary = 0;
                var relation_ted_trump = 0;
                var relation_ted_ben = 0;
                var relation_ted_bernie = 0;

                var total = rows.length;
                for (var i = 0; i < rows.length; i++) {

                    var temp = rows[i];
                    if (temp.text.toLowerCase().indexOf("trump") > -1 || temp.text.toLowerCase().indexOf("donald") > -1) {

                        relation_ted_trump++;
                    }
                    if (temp.text.toLowerCase().indexOf("ben") > -1 || temp.text.toLowerCase().indexOf("carson") > -1) {

                        relation_ted_ben++;
                    }
                    if (temp.text.toLowerCase().indexOf("hillary") > -1 || temp.text.toLowerCase().indexOf("clinton") > -1) {

                        relation_ted_hillary++;
                    }
                    if (temp.text.toLowerCase().indexOf("bernie") > -1 || temp.text.toLowerCase().indexOf("sanders") > -1) {

                        relation_ted_bernie++;
                    }

                }
                console.log(relation_ted_trump, relation_ted_ben, relation_ted_hillary, relation_ted_bernie, total);
                confusion_matrix[4][0] = relation_ted_trump;
                confusion_matrix[4][1] = relation_ted_hillary;
                confusion_matrix[4][2] = relation_ted_bernie;
                confusion_matrix[4][3] = relation_ted_ben;
                confusion_matrix[4][4] = total;
            }
            console.log(confusion_matrix);
            var nodes = [];
            var graphing = [];
            var names = ["Hillary Clinton", "Donald Trump", "Bernie Sanders", "Ben Carson", "Ted Cruz"]
            for (var i = 0; i < confusion_matrix.length; i++) {
                nodes.push({
                    "name": names[i],
                    "group": i
                });
            }
            //console.log(nodes);
            var links = [];
            for (var i = 0; i < confusion_matrix.length; i++) {
                for (var j = 0; j < confusion_matrix.length; j++) {
                    if (i != j) {
                        links.push({
                            "source": i,
                            "target": j,
                            "value": confusion_matrix[i][j]
                        });
                    }
                }
            }
            var temp = {
                "nodes": nodes,
                "links": links
            };
            console.log(temp);
            socket.emit('Graph', temp);
        });

        socket.on('initialTweetsByKeyword', function(keyword) {
            console.log(keyword);
            var queryString;
            if (keyword == "") {
                queryString = "SELECT * FROM Politics_2";
            } else {
                queryString = "SELECT * FROM Politics_2 WHERE keyword ='" + keyword + "'";
            }

            connection.query(queryString, function(error, rows) {
                if (error) {
                    console.log(error);
                } else {
                    //console.log(rows);
                    socket.emit('initialTweetsByKeyword', rows);
                }
            });
        });

        socket.on('HashTagsByKeyword', function(keyword) {
            console.log(keyword);
            var queryString;
            if (keyword == "") {
                queryString = "SELECT * FROM Politics_3";
            } else {
                queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
            }
            connection.query(queryString, function(error, rows) {
                if (error) {
                    console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
                } else {
                    var map = new HashMap();
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].hashtags != "[]") {
                            var temps = JSON.parse(rows[i].hashtags);
                            temps.forEach(function(temp) {
                                if (map.has(temp.text.toLowerCase())) {
                                    map.set(temp.text.toLowerCase(), map.get(temp.text.toLowerCase()) + 1);
                                } else {
                                    map.set(temp.text.toLowerCase(), 1);
                                }
                            });
                        }
                    }
                    var data = [];
                    map.forEach(function(value, key) {
                        data.push([key, value]);
                    });
                    data.sort(function(a, b) {
                        return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0
                    });
                    var points = [];
                    for (var i = 0; i < data.length; i++) {
                        var str1 = "#";
                        if (data[i][1] > 12) {
                            points.push({
                                "text": str1.concat(data[i][0]),
                                "size": 3 * data[i][1]
                            });
                        } else if (data[i][1] > 1 && data[i][1] < 12) {
                            points.push({
                                "text": str1.concat(data[i][0]),
                                "size": 6 * data[i][1]
                            });
                        }

                    }
                    socket.emit('HashTagsByKeyword', points);
                }
            });

        });

        socket.on('Query_tfif', function(input) {

            var keyword = "Hillary Clinton";
            var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
            connection.query(queryString, function(error, rows) {
                if (error) {
                    console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
                } else {
                    var str = rows[0].text.toLowerCase();
                    for (var i = 1; i < rows.length; i++) {
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
                    for (var i = 1; i < rows.length; i++) {
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
                    for (var i = 1; i < rows.length; i++) {
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
                    for (var i = 1; i < rows.length; i++) {
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
                    for (var i = 1; i < rows.length; i++) {
                        str = str.concat(rows[i].text.toLowerCase());
                    }
                    //console.log("Cat: ", str);
                    tfidf.addDocument(str);
                    var points = [];
                    var names = ["Hillary Clinton", "Donald Trump","Bernie Sanders","Ben Carson","Ted Cruz"];
                    tfidf.tfidfs(input, function(i, measure) {
                        console.log('document #' + names[i] + ' is ' + measure);
                        points.push([names[i],measure]);
                    });
                    console.log(points);
                    socket.emit('Query_tfif',points);

                }
            });


        });

        socket.on('Sentiment_Users', function(keyword) {
            console.log(keyword);
            var queryString;
            if (keyword == "") {
                queryString = "SELECT * FROM Politics_3";
            } else {
                queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
            }

            connection.query(queryString, function(error, rows) {
                if (error) {
                    console.log(error);
                } else {

                    var very_light_users = 0;
                    var light_users = 0;
                    var medium_users = 0;
                    var heavy_users = 0;
                    var positive = 0;
                    var negative = 0;
                    var neutral = 0;
                    var total = 0;
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].status_count_user < 100)
                            very_light_users++;
                        else if (rows[i].status_count_user > 100 && rows[i].status_count_user < 2500)
                            light_users++;
                        else if (rows[i].status_count_user > 2500 && rows[i].status_count_user < 10000)
                            medium_users++;
                        else if (rows[i].status_count_user > 10000)
                            heavy_users++;
                        if (JSON.parse(rows[i].sentiment) != null) {
                            if (JSON.parse(rows[i].sentiment).type == "positive")
                                positive++;
                            else if (JSON.parse(rows[i].sentiment).type == "negative")
                                negative++;
                            else if (JSON.parse(rows[i].sentiment).type == "neutral")
                                neutral++;
                            total++;
                        }

                    }
                    console.log(very_light_users, ",", light_users, ",", medium_users, ",", heavy_users, ",", rows.length);
                    console.log((very_light_users / rows.length) * 100, (light_users / rows.length) * 100, (medium_users / rows.length) * 100, (heavy_users / rows.length) * 100);
                    console.log(positive, negative, neutral, total);
                    console.log((positive / total) * 100, (negative / total) * 100, (neutral / total) * 100);
                    var temp = {
                        average_very_light: (very_light_users / rows.length) * 100,
                        average_light: (light_users / rows.length) * 100,
                        average_medium: (medium_users / rows.length) * 100,
                        average_heavy: (heavy_users / rows.length) * 100,
                        average_sentiment_positive: (positive / total) * 100,
                        average_sentiment_negative: (negative / total) * 100,
                        average_sentiment_neutral: (neutral / total) * 100,
                        very_light: very_light_users,
                        light: light_users,
                        medium: medium_users,
                        heavy: heavy_users,
                        positive_key: positive,
                        negative_key: negative,
                        neutral_key: neutral
                    };
                    socket.emit('Sentiment_Users', temp);
                }
            });
        });

    });

};
