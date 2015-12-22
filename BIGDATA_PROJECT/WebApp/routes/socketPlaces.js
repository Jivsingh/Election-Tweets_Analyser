// TWITTER CONFIGURATION
var Twit = require('twit');
var T = new Twit({
    consumer_key: '', 
    consumer_secret: '',
    access_token:'',
    access_token_secret: ''
});

// AWS CONFIGURATION
var aws = require('aws-sdk');
var accessKeyId = '';
var secretAccessKey = '';
var awsRegion = 'us-west-2';

// SQS CONFIGURATION
var sqs;
var queueURL = '';

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
    DelaySeconds: 0
};

// TRACKING
HtrackItems = ['hillary clinton','hillary2016'];
var streamHillary = T.stream('statuses/filter', { track: HtrackItems })

streamHillary.on('tweet', function (tweet) {

 	if(tweet.place!=null)
 	{
 		var temp ={
		id: tweet.id,
		name:tweet.user.name,
		keyword: 'Hillary Clinton',
		time:tweet.created_at,
		text :tweet.text,
		latitude: (tweet.place.bounding_box.coordinates[0][0][1]+ tweet.place.bounding_box.coordinates[0][1][1])/2.0,
        longitude: (tweet.place.bounding_box.coordinates[0][0][0]+ tweet.place.bounding_box.coordinates[0][2][0])/2.0,
		city: tweet.place.full_name
		}
		liveTweetIntoQueue(temp);
 	}
    

});

// DtrackItems = ['donald trump','trump2016','trump'];
// var streamDonald = T.stream('statuses/filter', { track: DtrackItems })

// streamDonald.on('tweet', function (tweet) {	
// 	if(tweet.place!=null)
//  	{
//  		var temp ={
// 		id: tweet.id,
// 		name:tweet.user.name,
// 		keyword: 'Donald Trump',
// 		time:tweet.created_at,
// 		text :tweet.text,
// 		latitude: (tweet.place.bounding_box.coordinates[0][0][1]+ tweet.place.bounding_box.coordinates[0][1][1])/2.0,
        // longitude: (tweet.place.bounding_box.coordinates[0][0][0]+ tweet.place.bounding_box.coordinates[0][2][0])/2.0,
// 		city: tweet.place.full_name
// 		}
// 		liveTweetIntoQueue(temp);
//  	}
// });

// BtrackItems = ['ben carson','carson2016', 'RealBenCarson'];
// var streamBCarson = T.stream('statuses/filter', { track: BtrackItems })

// streamBCarson.on('tweet', function (tweet) {	
// 	if(tweet.place!=null)
//  	{
//  		var temp ={
// 		id: tweet.id,
// 		name:tweet.user.name,
// 		keyword: 'Ben Carson',
// 		time:tweet.created_at,
// 		text :tweet.text,
// 		latitude: (tweet.place.bounding_box.coordinates[0][0][1]+ tweet.place.bounding_box.coordinates[0][1][1])/2.0,
        // longitude: (tweet.place.bounding_box.coordinates[0][0][0]+ tweet.place.bounding_box.coordinates[0][2][0])/2.0,
// 		city: tweet.place.full_name
// 		}
// 		liveTweetIntoQueue(temp);
//  	}
// });

// StrackItems = ['bernie sanders','bernie2016'];
// var streamBSanders = T.stream('statuses/filter', { track: StrackItems })

// streamBSanders.on('tweet', function (tweet) {	
// 	if(tweet.place!=null)
//  	{
//  		var temp ={
// 		id: tweet.id,
// 		name:tweet.user.name,
// 		keyword: 'Bernie Sanders',
// 		time:tweet.created_at,
// 		text :tweet.text,
// 		latitude: (tweet.place.bounding_box.coordinates[0][0][1]+ tweet.place.bounding_box.coordinates[0][1][1])/2.0,
        // longitude: (tweet.place.bounding_box.coordinates[0][0][0]+ tweet.place.bounding_box.coordinates[0][2][0])/2.0,
// 		city: tweet.place.full_name
// 		}
// 		liveTweetIntoQueue(temp);
//  	}
// });

// CruztrackItems = ['ted cruz','cruz2016'];
// var streamTcruz = T.stream('statuses/filter', { track: CruztrackItems })

// streamTcruz.on('tweet', function (tweet) {	
// 	if(tweet.place!=null)
//  	{
//  		var temp ={
// 		id: tweet.id,
// 		name:tweet.user.name,
// 		keyword: 'Ted Cruz',
// 		time:tweet.created_at,
// 		text :tweet.text,
// 		latitude: (tweet.place.bounding_box.coordinates[0][0][1]+ tweet.place.bounding_box.coordinates[0][1][1])/2.0,
        // longitude: (tweet.place.bounding_box.coordinates[0][0][0]+ tweet.place.bounding_box.coordinates[0][2][0])/2.0,
// 		city: tweet.place.full_name
// 		}
// 		liveTweetIntoQueue(temp);
//  	}
// });

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