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

var aws = require('aws-sdk');
var accessKeyId = '';
var secretAccessKey = '';
var awsRegion = 'us-west-2';

// SQS CONFIGURATION
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

var queueURL = '';

var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('');

    var app = Consumer.create({
    queueUrl: queueURL,
    region: awsRegion,
    batchSize: 1,
    handleMessage: function(message, done) {
        //var temp = JSON.stringify(message.Body.Text);
        var body = JSON.parse(message.Body);
        console.log('Received from the queue:', body);
        calculateSentiment(body);
        return done();
    }
});
app.on('error', function(err) {
    console.log('Error occured while getting tweets from queue');
    liveTweetIntoQueue(body);
});
app.start();

function calculateSentiment(body) {
    var message = body.text;
    alchemy.sentiment(message, {}, (err, result) => {
        if (!err) {
            console.log('sentiment is: ', result.docSentiment);
            console.log(message);
            putSentimentintoDB(body,JSON.stringify(result.docSentiment));
        }
    });
}


function putSentimentintoDB(body, sentiments)
{
    var pass ={
        id: body.id,
        name:body.name,
        keyword: body.keyword,
        time: "DEC 02",
        text :body.text,
        sentiment: sentiments,
        latitude: body.latitude,
        longitude: body.longitude,
        city: body.city
    }
    connection.query('INSERT INTO Politics_2 SET ?', pass, (err, result) => {
        if (err) {
            console.log('ERROR while inserting into Politics_2!');
            liveTweetIntoQueue(body);
        } else {
            console.log('finished putting tweet in the Politics_2: ', pass);
        }
    });
}

function liveTweetIntoQueue(temp) {
    params.MessageBody =  JSON.stringify(temp);
    sqs.sendMessage(params, (err, result) => {
        if (err) {
            console.log('Error while sending into the queue');
        } else {
            console.log('finished putting the tweet in the queue:', params.MessageBody);
        }
    });
}