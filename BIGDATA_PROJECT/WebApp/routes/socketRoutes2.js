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

var awsRegion = 'us-west-2';
var queueURL = 'https://sqs.us-west-2.amazonaws.com/239427429364/TweetPolitics';

var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('a8143b4a4d3e7c19c92c90cac8232537a7b7c23c');

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
        sentiment: sentiments
    }
    connection.query('INSERT INTO Politics_1 SET ?', pass, (err, result) => {
        if (err) {
            console.log('ERROR while inserting into Politics_1!');
        } else {
            console.log('finished putting tweet in the Politics_1: ', pass);
        }
    });
}