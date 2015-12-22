var Consumer = require('sqs-consumer');

// DATABASE CONFIGURATION
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

var awsRegion = 'us-west-2';
var queueURL = '';
var aws = require('aws-sdk');
var accessKeyId = '';
var secretAccessKey = '';


var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('');

var sqs;

aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: awsRegion
});

// SQS
sqs = new aws.SQS();
var params = {
    QueueUrl: queueURL,
    DelaySeconds: 0
};


    var app = Consumer.create({
    queueUrl: queueURL,
    region: awsRegion,
    batchSize: 1,
    handleMessage: function(message, done) {
        //var temp = JSON.stringify(message.Body.Text);
        var body = JSON.parse(message.Body);
        //console.log('Received from the queue:', body);
        calculateSentiment(body);
        return done();
    }
});
app.on('error', function(err) {
    console.log('Error occured while getting tweets from queue');
    // liveTweetIntoQueue(body);
});
app.start();

function calculateSentiment(body) {
    var message = body.text;
    alchemy.sentiment(message, {}, (err, result) => {
        if (!err) {
            //console.log('sentiment is: ', result.docSentiment);
            //console.log(message);
            putSentimentintoDB(body,JSON.stringify(result.docSentiment));
        }
    });
}


function putSentimentintoDB(body, sentiments)
{
    var pass = {
        id: body.id,
        name:body.name,
        keyword: body.keyword,
        time: body.time,
        text :body.text,
        favorite_count_tweet: body.favorite_count_tweet,
        retweet_count_tweet:body.retweet_count_tweet,
        hashtags: JSON.stringify(body.hashtags),
        favourite_count_user: body.favourite_count_user,
        followers_count_user: body.followers_count_user,
        friends_count_user: body.friends_count_user,
        status_count_user: body.status_count_user,
        listed_count_user: body.listed_count_user,
        sentiment: sentiments
    }
    connection.query('INSERT INTO Politics_3 SET ?', pass, (err, result) => {
        if (err) {
            console.log('ERROR while inserting into Politics_3!');
            // liveTweetIntoQueue(body);
        } else {
            console.log('finished putting tweet in the Politics_3: ', pass);
        }
    });
}

function liveTweetIntoQueue(temp) {
    params.MessageBody =  JSON.stringify(temp);
    sqs.sendMessage(params, (err, result) => {
        if (err) {
            console.log('Error while sending into the queue');
        } else {
            //console.log('finished putting the tweet in the queue:', params.MessageBody);
        }
    });
}