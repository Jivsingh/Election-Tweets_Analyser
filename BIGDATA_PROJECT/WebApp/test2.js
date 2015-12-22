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
// var confusion_matrix = [];
// for (var i=0;i<confusion_matrix;i++) {
//      confusion_matrix[i] = [];
//   }

var confusion_matrix = new Array();

for (i=0;i<5;i++) {
 confusion_matrix[i]=new Array();
 for (j=0;j<5;j++) {
  confusion_matrix[i][j]=0;
 }
}
var keyword = "Hillary Clinton";
var queryString = "SELECT * FROM Politics_3 WHERE keyword ='" + keyword + "'";
connection.query(queryString, function(error, rows) {
            if (error) {
                console.log('Oh no! Error occurred while getting tweets from the DataBase', error);
            } else {
                var relation_hillary_bernie = 0;
                    var relation_hillary_ted = 0;
                    var relation_hillary_trump = 0;
                    var relation_hillary_ben = 0;
                    var total_hillary = 0;
                    var total = 0;
                for (var i = 0;i<rows.length;i++)
                {
                    
                	if(rows[i].hashtags!="[]")
                	{
                        total++;
                	var temps = JSON.parse(rows[i].hashtags);
                	temps.forEach(function(temp){
                        if(temp.text.toLowerCase().indexOf("bernie")> -1 || temp.text.toLowerCase().indexOf("sanders")> -1 )
                        {
                            total_hillary++;
                            relation_hillary_bernie++;
                        }
                        if(temp.text.toLowerCase().indexOf("ted")> -1|| temp.text.toLowerCase().indexOf("cruz")> -1)
                        {
                            total_hillary++;
                            relation_hillary_ted++;
                        }
                        if(temp.text.toLowerCase().indexOf("trump")> -1 || temp.text.toLowerCase().indexOf("donald")> -1)
                        {
                            total_hillary++;
                            relation_hillary_trump++;
                        }
                        if(temp.text.toLowerCase().indexOf("ben")> -1 || temp.text.toLowerCase().indexOf("carson")> -1)
                        {
                            total_hillary ++;
                            relation_hillary_ben++;
                        }
                	});
                }
                }
                console.log(relation_hillary_bernie, relation_hillary_ted,relation_hillary_trump, relation_hillary_ben, total_hillary);
                confusion_matrix [1][0] = relation_hillary_trump;
                confusion_matrix [1][1] = total;
                confusion_matrix [1][2] = relation_hillary_bernie;
                confusion_matrix [1][3] = relation_hillary_ben;
                confusion_matrix [1][4] = relation_hillary_ted;
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
                    var total_trump = 0;
                    var total = 0;
                for (var i = 0;i<rows.length;i++)
                {
                    
                    if(rows[i].hashtags!="[]")
                    {
                        total++;
                    var temps = JSON.parse(rows[i].hashtags);
                    temps.forEach(function(temp){
                        if(temp.text.toLowerCase().indexOf("bernie")> -1 || temp.text.toLowerCase().indexOf("sanders")> -1 )
                        {
                            total_trump++;
                            relation_trump_bernie++;
                        }
                        if(temp.text.toLowerCase().indexOf("ted")> -1|| temp.text.toLowerCase().indexOf("cruz")> -1)
                        {
                            total_trump ++;
                            relation_trump_ted++;
                        }
                        if(temp.text.toLowerCase().indexOf("hillary")> -1 || temp.text.toLowerCase().indexOf("clinton")> -1)
                        {
                            total_trump++;
                            relation_trump_hillary++;
                        }
                        if(temp.text.toLowerCase().indexOf("ben")> -1 || temp.text.toLowerCase().indexOf("carson")> -1)
                        {
                            total_trump ++;
                            relation_trump_ben++;
                        }
                    });
                }
                }
                console.log(relation_trump_bernie, relation_trump_ted,relation_trump_hillary, relation_trump_ben, total_trump );
                confusion_matrix [0][0] = total;
                confusion_matrix [0][1] = relation_trump_hillary;
                confusion_matrix [0][2] = relation_trump_bernie;
                confusion_matrix [0][3] = relation_trump_ben;
                confusion_matrix [0][4] = relation_trump_ted;
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
                    var total_bernie = 0;
                    var total = 0;
                for (var i = 0;i<rows.length;i++)
                {
                    
                    if(rows[i].hashtags!="[]")
                    {
                        total++;
                    var temps = JSON.parse(rows[i].hashtags);
                    temps.forEach(function(temp){
                        if(temp.text.toLowerCase().indexOf("trump")> -1 || temp.text.toLowerCase().indexOf("donald")> -1 )
                        {
                            total_bernie++;
                            relation_bernie_trump++;
                        }
                        if(temp.text.toLowerCase().indexOf("ted")> -1|| temp.text.toLowerCase().indexOf("cruz")> -1)
                        {
                            total_bernie++;
                            relation_bernie_ted++;
                        }
                        if(temp.text.toLowerCase().indexOf("hillary")> -1 || temp.text.toLowerCase().indexOf("clinton")> -1)
                        {
                            total_bernie++;
                            relation_bernie_hillary++;
                        }
                        if(temp.text.toLowerCase().indexOf("ben")> -1 || temp.text.toLowerCase().indexOf("carson")> -1)
                        {
                            total_bernie++;
                            relation_bernie_ben ++;
                        }
                    });
                }
                }
                console.log(relation_bernie_trump, relation_bernie_ted,relation_bernie_hillary, relation_bernie_ben, total_bernie );
                confusion_matrix [2][0] = relation_bernie_trump;
                confusion_matrix [2][1] = relation_bernie_hillary;
                confusion_matrix [2][2] = total;
                confusion_matrix [2][3] = relation_bernie_ben;
                confusion_matrix [2][4] = relation_bernie_ted;
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
                    var total_ben = 0;
                    var total = 0;
                for (var i = 0;i<rows.length;i++)
                {
                    
                    if(rows[i].hashtags!="[]")
                    {
                        total++;
                    var temps = JSON.parse(rows[i].hashtags);
                    temps.forEach(function(temp){
                        if(temp.text.toLowerCase().indexOf("trump")> -1 || temp.text.toLowerCase().indexOf("donald")> -1 )
                        {
                            total_ben++;
                            relation_ben_trump++;
                        }
                        if(temp.text.toLowerCase().indexOf("ted")> -1|| temp.text.toLowerCase().indexOf("cruz")> -1)
                        {
                            total_ben++;
                            relation_ben_ted++;
                        }
                        if(temp.text.toLowerCase().indexOf("hillary")> -1 || temp.text.toLowerCase().indexOf("clinton")> -1)
                        {
                            total_ben++;
                            relation_ben_hillary ++;
                        }
                        if(temp.text.toLowerCase().indexOf("bernie")> -1 || temp.text.toLowerCase().indexOf("sanders")> -1)
                        {
                            total_ben++;
                            relation_ben_bernie ++;
                        }
                    });
                }
                }
                console.log(relation_ben_trump, relation_ben_ted,relation_ben_hillary, relation_ben_bernie, total_ben);
                confusion_matrix [3][0] = relation_ben_trump;
                confusion_matrix [3][1] = relation_ben_hillary;
                confusion_matrix [3][2] = relation_ben_bernie;
                confusion_matrix [3][3] = total;
                confusion_matrix [3][4] = relation_ben_ted;
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
                    var total_ted = 0;
                    var total = 0;
                for (var i = 0;i<rows.length;i++)
                {
                    
                    if(rows[i].hashtags!="[]")
                    {
                        total++;
                    var temps = JSON.parse(rows[i].hashtags);
                    temps.forEach(function(temp){
                        if(temp.text.toLowerCase().indexOf("trump")> -1 || temp.text.toLowerCase().indexOf("donald")> -1 )
                        {
                            total_ted ++;
                            relation_ted_trump++;
                        }
                        if(temp.text.toLowerCase().indexOf("ben")> -1|| temp.text.toLowerCase().indexOf("carson")> -1)
                        {
                            total_ted ++;
                            relation_ted_ben++;
                        }
                        if(temp.text.toLowerCase().indexOf("hillary")> -1 || temp.text.toLowerCase().indexOf("clinton")> -1)
                        {
                            total_ted++;
                            relation_ted_hillary ++;
                        }
                        if(temp.text.toLowerCase().indexOf("bernie")> -1 || temp.text.toLowerCase().indexOf("sanders")> -1)
                        {
                            total_ted++;
                            relation_ted_bernie ++;
                        }
                    });
                }
                }
                console.log(relation_ted_trump, relation_ted_ben,relation_ted_hillary, relation_ted_bernie, total_ted );
                confusion_matrix [4][0] = relation_ted_trump;
                confusion_matrix [4][1] = relation_ted_hillary;
                confusion_matrix [4][2] = relation_ted_bernie;
                confusion_matrix [4][3] = relation_ted_ben;
                confusion_matrix [4][4] = total;
            }
            console.log(confusion_matrix);
        });

