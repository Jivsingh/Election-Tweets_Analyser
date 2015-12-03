//var worker = require('./consumer');

// TRENDS

var Twit = require('twit');
var T = new Twit({
    consumer_key: 'AkE1t4fn5zDgcVOMUBjcT2pzM',
    consumer_secret: 'vdB1cOrPCbyLtFGL9qaPWyB2uC6RKO5iAoPkSWf3Dx2ctTnjOx',
    access_token: '3990273435-08DhKM6xhHnjk6zJGcshqKZaD2Re20zxI1TpC2y',
    access_token_secret: 'SOxFfgLwicGFBnGNIH8nR2JcymKVWWpO5NmaFYz3jkOC8'
});

data1=[];
T.get('trends/place', {id: "2459115"}, function(err, data) {
    if (typeof data === "undefined") {
      //res.json({status: false});
    } else {
      //res.json({trends: data, status: true});
      for(var i=0;i<10;i++)
      {
      console.log(JSON.stringify(data[0].trends[i].name));
      data1.push(JSON.stringify(data[0].trends[i].name));
      }
    }
  });


data2=[];
T.get('trends/place', {id: "23424975"}, function(err, data) {
    if (typeof data === "undefined") {
      //res.json({status: false});
    } else {
      //res.json({trends: data, status: true});
      for(var i=0;i<10;i++)
      {
      console.log(JSON.stringify(data[0].trends[i].name));
      data2.push(JSON.stringify(data[0].trends[i].name));
      }
    }
  });


// AWS CONFIGURATION
var aws = require('aws-sdk');
var accessKeyId = 'AKIAJXXZENDMN4TCYO2A';
var secretAccessKey = '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';
var awsRegion = 'us-west-2';

// SQS CONFIGURATION
var sqs;
var aysnc = require('async');
var queueURL = 'https://sqs.us-west-2.amazonaws.com/239427429364/TweetsQueue';

// ALCHEMY API CONFIGURATION
var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('a8143b4a4d3e7c19c92c90cac8232537a7b7c23c');

// AWS
aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: awsRegion
});

// SQS
sqs = new aws.SQS();
var params = {
    QueueUrl: queueURL,
    DelaySeconds: 1
};

// SNS
var sns = new aws.SNS();
 var snspublishParams = { 
    TopicArn : "arn:aws:sns:us-west-2:239427429364:tweeter", 
     Message: "Success"
 };

// WORKER POOL
var Consumer = require('sqs-consumer');

// DATABASE CONFIGURATION
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

// TWITTER CONFIGURATION
var Twitter = require('node-tweet-stream');
trackItems = ["love", "hate", "happy", "fun", "mtvema", "family"];
count = [0, 0, 0, 0, 0, 0];
var socketList = [];
var t = new Twitter({
    consumer_key: 'AkE1t4fn5zDgcVOMUBjcT2pzM',
    consumer_secret: 'vdB1cOrPCbyLtFGL9qaPWyB2uC6RKO5iAoPkSWf3Dx2ctTnjOx',
    token: '3990273435-08DhKM6xhHnjk6zJGcshqKZaD2Re20zxI1TpC2y',
    token_secret: 'SOxFfgLwicGFBnGNIH8nR2JcymKVWWpO5NmaFYz3jkOC8'
});

trackItems.forEach(function(item) {
    t.track(item);
});

t.on('tweet', function(tweet) {
    if (tweet.geo) {
        keyword = null;
        for (var i = 0; i < trackItems.length; i++) {
            if (tweet.text.indexOf(trackItems[i]) > -1) {
                keyword = trackItems[i];
                count[i]++;
                break;
            }
        }

        if (keyword != null) {
            socketList.forEach(function(socket) {
                var temp = {
                    ID: tweet.id,
                    Name: tweet.user.name,
                    Latitude: tweet.geo.coordinates[0],
                    Longitude: tweet.geo.coordinates[1],
                    Text: tweet.text,
                    Keyword: keyword
                };

          
                liveTweetIntoDB(temp);
                liveTweetIntoQueue(temp);
                //socket.emit('tweet', temp);
                socket.emit('trends',data1, data2);
                getTweetFromQueue(socket,temp);
            });

        }
    }
});

t.on('error', function(err) {
    console.err('Oh no! Error occurred while getting tweets from the stream', err);
});

function liveTweetIntoDB(pass) {

    connection.query('INSERT INTO DBtweets SET ?', pass, (err, result) => {
        if (err) {
            console.log('ERROR while inserting into DB!');
        } else {
            console.log('finished putting tweet in the DB: ', pass);
        }
    });
}

function liveTweetIntoQueue(temp) {
    params.MessageBody =  JSON.stringify(temp);
    console.log(" the queue: ",params.MessageBody);
    sqs.sendMessage(params, (err, result) => {
        if (err) {
            console.log('Error while sending into the queue');
        } else {
            console.log('finished putting the tweet in the queue:', params.MessageBody);
        }
    });
}

function getTweetFromQueue(socket,temp) {
    var app = Consumer.create({
        queueUrl: queueURL,
        region: awsRegion,
        batchSize: 10,
        handleMessage: function(message, done) {
            //var temp = JSON.stringify(message.Body.Text);
            var body = JSON.parse(message.Body);
            console.log('Received from the queue:', body);
            calculateSentiment(body.Text, body.ID,socket,temp);
            return done();
        }
    });
    app.on('error', function(err) {
        console.log('Error occured while getting tweets from queue');
    });
    app.start();
}

// function removeFromQueue(message) {
//     sqs.deleteMessage({
//         QueueUrl: 'https://sqs.us-west-2.amazonaws.com/239427429364/TweetQueue',
//         ReceiptHandle: message.ReceiptHandle
//     }, function(err, data) {
//         // If we errored, tell us that we did
//         console.log('Remove From Queue');
//     });
// }

function calculateSentiment(message, ID,socket,temp) {
    alchemy.sentiment(message, {}, (err, result) => {
        if (!err) {
            console.log('sentiment is: ', result.docSentiment);
            console.log(message);

             sns.publish(snspublishParams, function(err, data) {
                if (err) {
                    console.log(" The error for SNS",err);
                } else {
                    console.log("SNS SUCCESS");
                    var temper = {
                    ID: temp.ID,
                    Name: temp.Name,
                    Latitude: temp.Latitude,
                    Longitude: temp.Longitude,
                    Text: temp.Text,
                    Keyword: temp.Keyword,
                    Sentiment: result.docSentiment
                    };
                    socket.emit('tweet',temper);
                }
                });
            putSentimentintoDB(JSON.stringify(result.docSentiment), ID);
            console.log('Hello');
        }
    });
}

function putSentimentintoDB(Sentiment, ID)
{
	var pass =  {
                 ID: ID,
                 Sentiment: Sentiment
             	};
	connection.query('INSERT INTO TweetSentiment SET ?', pass, (err, result) => {
        if (err) {
            console.log('ERROR while inserting into DBSentiment!');
        } else {
            console.log('finished putting tweet in the DBSentiment: ', pass);
        }
    });
}

function intialTweetsDB(io) {

    io.on('connection', function(socket) {
        socketList.push(socket);
        socket.emit('connectionSuccessful', "Connection Successful");
        var queryString = 'SELECT * FROM DBtweets';
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {
                socket.emit('initialTweets', rows);
            }
        });


        socket.on('initialTweetsByKeyword', function(Keyword) {
            var queryString;
            if (keyword == "") {
                queryString = "SELECT * FROM DBtweets";
            } else {
                queryString = "SELECT * FROM DBtweets WHERE Keyword ='" + Keyword + "'";
            }

            connection.query(queryString, function(error, rows) {
                if (error) {
                    console.log(error);
                } else {

                    socket.emit('initialTweetsByKeyword', rows);
                }
            });
        });

    });
};

module.exports.intialTweetsDB = intialTweetsDB;
 module.exports.liveTweetIntoQueue = liveTweetIntoQueue;
 module.exports.liveTweetIntoDB = liveTweetIntoDB;
