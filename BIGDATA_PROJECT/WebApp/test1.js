// Divide the data by user's usage of twitter  && total positive and negative sentiments //average 

// Very light users - <100
// Light users >100 && 2500
//meduim users 2500 && 10,000
//Heavy users >10,000
var mysql = require('mysql');
var HashMap = require('hashmap');
var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
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
            	var very_light_users = 0;
            	var light_users = 0;
            	var medium_users = 0;
            	var heavy_users = 0;
            	var positive = 0;
            	var negative = 0;
            	var neutral = 0;
            	var average_positive = 0;
            	var average_negative = 0;
            	var average_neutral = 0;
            	var total = 0;
            	for( var i = 0;i<rows.length;i++)
            	{
            		if(rows[i].status_count_user<100)
            			very_light_users++;
            		else if(rows[i].status_count_user>100 && rows[i].status_count_user<2500)
            			light_users++;
            		else if(rows[i].status_count_user>2500 && rows[i].status_count_user<10000)
            			medium_users++;
            		else if(rows[i].status_count_user>10000)
            			heavy_users++;
            		if(JSON.parse(rows[i].sentiment)!=null)
            		{
            		if(JSON.parse(rows[i].sentiment).type == "positive")
            			positive++;
            		else if(JSON.parse(rows[i].sentiment).type == "negative")
            			negative++;
            		else if(JSON.parse(rows[i].sentiment).type == "neutral")
            			neutral++;
            		total++;
            		}

            	}
            	console.log(very_light_users,",",light_users,",", medium_users,",",heavy_users, ",",rows.length);
            	console.log((very_light_users/rows.length)*100,(light_users/rows.length)*100,(medium_users/rows.length)*100,(heavy_users/rows.length)*100);
				console.log(positive,negative,neutral, total);
				console.log((positive/total)*100, (negative/total)*100 , (neutral/total)*100);      
            }
           });
