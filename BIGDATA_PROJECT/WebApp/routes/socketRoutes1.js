
// TWITTER CONFIGURATION
var Twit = require('twit');
var T = new Twit({
    consumer_key: 'AkE1t4fn5zDgcVOMUBjcT2pzM', 
    consumer_secret: 'vdB1cOrPCbyLtFGL9qaPWyB2uC6RKO5iAoPkSWf3Dx2ctTnjOx',
    access_token:'3990273435-08DhKM6xhHnjk6zJGcshqKZaD2Re20zxI1TpC2y',
    access_token_secret: 'SOxFfgLwicGFBnGNIH8nR2JcymKVWWpO5NmaFYz3jkOC8'
});

// AWS CONFIGURATION
var aws = require('aws-sdk');
var accessKeyId = 'AKIAJXXZENDMN4TCYO2A';
var secretAccessKey = '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';
var awsRegion = 'us-west-2';

// SQS CONFIGURATION
var sqs;
var queueURL = 'https://sqs.us-west-2.amazonaws.com/239427429364/Others';

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
// HtrackItems = ['hillary', 'hillary2016','hillaryclinton','hillary clinton'];
// var streamHillary = T.stream('statuses/filter', { track: HtrackItems })

// streamHillary.on('tweet', function (tweet) {	
// 	var temp = {
// 		id: tweet.id,
// 		name:tweet.user.name,
// 		keyword: 'Hillary Clinton',
// 		time: 'DEC 9',
// 		text :tweet.text,
// 		favorite_count_tweet: tweet.favorite_count,
// 		retweet_count_tweet:tweet.retweet_count,
// 		hashtags: tweet.entities.hashtags,
// 		favourite_count_user: tweet.user.favourites_count,
// 		followers_count_user: tweet.user.followers_count,
// 		friends_count_user: tweet.user.friends_count,
// 		status_count_user: tweet.user.statuses_count,
// 		listed_count_user: tweet.user.listed_count
// 	}
//  	liveTweetIntoQueue(temp);
// });

// DtrackItems = ['donald trump','trump2016','trump', 'donaldtrump'];
// var streamDonald = T.stream('statuses/filter', { track: DtrackItems })

// streamDonald.on('tweet', function (tweet) {	
// 	var temp = {
// 		id: tweet.id,
// 		name:tweet.user.name,
// 		keyword: 'Donald Trump',
// 		time: 'DEC 9',
// 		text :tweet.text,
// 		favorite_count_tweet: tweet.favorite_count,
// 		retweet_count_tweet:tweet.retweet_count,
// 		hashtags: tweet.entities.hashtags,
// 		favourite_count_user: tweet.user.favourites_count,
// 		followers_count_user: tweet.user.followers_count,
// 		friends_count_user: tweet.user.friends_count,
// 		status_count_user: tweet.user.statuses_count,
// 		listed_count_user: tweet.user.listed_count
// 	}
//   	liveTweetIntoQueue(temp);
// });

// BtrackItems = ['ben carson','carson2016', 'RealBenCarson','bencarson'];
// var streamBCarson = T.stream('statuses/filter', { track: BtrackItems })

// streamBCarson.on('tweet', function (tweet) {	
// 	var temp = {
// 		id: tweet.id,
// 		name:tweet.user.name,
// 		keyword: 'Ben Carson',
// 		time: 'DEC 9',
// 		text :tweet.text,
// 		favorite_count_tweet: tweet.favorite_count,
// 		retweet_count_tweet:tweet.retweet_count,
// 		hashtags: tweet.entities.hashtags,
// 		favourite_count_user: tweet.user.favourites_count,
// 		followers_count_user: tweet.user.followers_count,
// 		friends_count_user: tweet.user.friends_count,
// 		status_count_user: tweet.user.statuses_count,
// 		listed_count_user: tweet.user.listed_count
// 	}
//   liveTweetIntoQueue(temp);
// });

// StrackItems = ['bernie sanders','bernie2016','berniesanders'];
// var streamBSanders = T.stream('statuses/filter', { track: StrackItems })

// streamBSanders.on('tweet', function (tweet) {	
// var temp = {
// 		id: tweet.id,
// 		name:tweet.user.name,
// 		keyword: 'Bernie Sanders',
// 		time: 'DEC 9',
// 		text :tweet.text,
// 		favorite_count_tweet: tweet.favorite_count,
// 		retweet_count_tweet:tweet.retweet_count,
// 		hashtags: tweet.entities.hashtags,
// 		favourite_count_user: tweet.user.favourites_count,
// 		followers_count_user: tweet.user.followers_count,
// 		friends_count_user: tweet.user.friends_count,
// 		status_count_user: tweet.user.statuses_count,
// 		listed_count_user: tweet.user.listed_count
// 	}
//  liveTweetIntoQueue(temp);
// });

CruztrackItems = ['ted cruz','cruz2016','tedcruz'];
var streamTcruz = T.stream('statuses/filter', { track: CruztrackItems })

streamTcruz.on('tweet', function (tweet) {	
var temp = {
		id: tweet.id,
		name:tweet.user.name,
		keyword: 'Ted Cruz',
		time: 'DEC 9',
		text :tweet.text,
		favorite_count_tweet: tweet.favorite_count,
		retweet_count_tweet:tweet.retweet_count,
		hashtags: tweet.entities.hashtags,
		favourite_count_user: tweet.user.favourites_count,
		followers_count_user: tweet.user.followers_count,
		friends_count_user: tweet.user.friends_count,
		status_count_user: tweet.user.statuses_count,
		listed_count_user: tweet.user.listed_count
	}
 liveTweetIntoQueue(temp);
});

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




