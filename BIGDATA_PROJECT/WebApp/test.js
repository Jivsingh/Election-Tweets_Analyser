// Collect the hashtags per person!

var mysql = require('mysql');
var HashMap = require('hashmap');
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
                var map = new HashMap();
                for (var i = 0;i<rows.length;i++)
                {
                	if(rows[i].hashtags!="[]")
                	{
                	var temps = JSON.parse(rows[i].hashtags);
                	temps.forEach(function(temp){
                		if(map.has(temp.text.toLowerCase()))
                		{
                			map.set(temp.text.toLowerCase(), map.get(temp.text.toLowerCase())+1);
                		}
                		else
                		{
                			map.set(temp.text.toLowerCase(),1);
                		}
                	});
                }
                }
                var data = [];
                map.forEach(function(value, key) {
    					data.push([key,value]);
						});
                data.sort(function(a, b) { return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0 });
                //console.log(data);
                var points = [];
                for (var i = 0;i < data.length;i++)
                {

                    points.push({"text": data[i][0], "size" : 4*data[i][1]});
                }
                console.log(points);
            }
        });