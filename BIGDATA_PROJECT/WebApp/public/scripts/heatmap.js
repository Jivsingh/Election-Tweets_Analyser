var map, heatmap, heatmap2,heatmap3;
var currentKeyword = "";
var initialTweets;
var socket;
var markers = [];
var tweetTable;
var mapOne;
var mapTwo;
var hateDivElem;
var happyDivElem;
var funDivElem;
var familyDivElem;
var loveDivElem;
var mtvemaDivElem;
var totalCountDivElem;
var UKDivElem;
var NewYorkDivElem;

function initHeatMapTemp() {
    mapOne = new google.maps.Map(document.getElementById('heatmap'), {
        zoom: 1,
        center: {
            lat: 37.775,
            lng: -122.434
        },
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    NewYorkDivElem = document.getElementById('NewYork');
    UKDivElem = document.getElementById('UK');
    hateDivElem = document.getElementById('hateCount');
    happyDivElem = document.getElementById('happyCount');
    funDivElem = document.getElementById('funCount');
    loveDivElem = document.getElementById('loveCount');
    familyDivElem = document.getElementById('familyCount');
    mtvemaDivElem = document.getElementById('mtvemaCount');
    tweetTable = document.getElementById('tweettable');
    totalCountDivElem = document.getElementById('totalCount');

    var myLatLng = {
        lat: -25.363,
        lng: 131.044
    };

    mapTwo = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: myLatLng
    });

    var url = window.location.href;
    var arr = url.split("/");
    var socketURI = arr[0] + "//" + arr[1];

    socket = io.connect(socketURI);
    socket.on('connectionSuccessful', function(data) {
        console.log("conn:" + data);
    });
  
    socket.on('initialTweets', function(tweets) {
        initialTweets = tweets;
        initMap();
        initHeatMap();
    });

    socket.on('trends', function(data1,data2){

        NewYorkDivElem.innerHTML = data1;
        UKDivElem.innerHTML = data2;
    });

    socket.on('initialTweetsByKeyword', function(tweets) {
        initialTweets = tweets;
        initMap();
        initHeatMap();
    });

    socket.on('tweet', function(tweet) {

        if (currentKeyword && currentKeyword.toLowerCase() != tweet.Keyword.toLowerCase()) {
            return;
        }

        switch (tweet.Keyword.toLowerCase()) {
             case 'love':
                 loveDivElem.innerHTML = parseInt(loveDivElem.innerHTML) + 1;
                 break;
             case 'family':
                 familyDivElem.innerHTML = parseInt(familyDivElem.innerHTML) + 1;
                 break;
             case 'happy':
                 happyDivElem.innerHTML = parseInt(happyDivElem.innerHTML) + 1;
                 break;
             case 'mtvema':
                 mtvemaDivElem.innerHTML = parseInt(mtvemaDivElem.innerHTML) + 1;
                 break;
             case 'fun':
                 funDivElem.innerHTML = parseInt(funDivElem.innerHTML) + 1;
                 break;
             case 'hate':
                 hateDivElem.innerHTML = parseInt(hateDivElem.innerHTML) + 1;
                 break;
         }

       totalCountDivElem.innerHTML = parseInt(totalCountDivElem.innerHTML) + 1;
       if(tweet.Sentiment.type=="positive")
       {
        var marker = new google.maps.Marker({
            position: {
                lat: tweet.Latitude,
                lng: tweet.Longitude
            },
            map: mapTwo,
            icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            animation: google.maps.Animation.BOUNCE,
            title: tweet.Name + "\n" + tweet.Text
        });
        }
        else if(tweet.Sentiment.type=="negative")
        {
          var marker = new google.maps.Marker({
            position: {
                lat: tweet.Latitude,
                lng: tweet.Longitude
            },
            map: mapTwo,
            icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            animation: google.maps.Animation.BOUNCE,
            title: tweet.Name + "\n" + tweet.Text
        });  
        }
        else if(tweet.Sentiment.type=="neutral")
        {
           var marker = new google.maps.Marker({
            position: {
                lat: tweet.Latitude,
                lng: tweet.Longitude
            },
            map: mapTwo,
            icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            animation: google.maps.Animation.BOUNCE,
            title: tweet.Name + "\n" + tweet.Text
        });   
        }
        console.log("The live tweets",tweet);
        markers.push(marker);
        tweetTable.innerHTML += createTable(tweet);
    });

}



function initMap() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    var marker;
    markers = [];

    var funCount = 0;
    var familyCount = 0;
    var happyCount = 0;
    var mtvemaCount = 0;
    var loveCount = 0;
    var hateCount = 0;
    var totalCount = 0;

    tweetTable.innerHTML = "";

    for (var i = 0; i < initialTweets.length; i++) {

         switch (initialTweets[i].Keyword.toLowerCase()) {
                case 'love':
                   loveCount++;
                    break;
                case 'family':
                    familyCount++;
                    break;
                case 'happy':
                    happyCount++;
                    break;
                case 'mtvema':
                    mtvemaCount++;
                    break;
                case 'fun':
                    funCount++;
                    break;
                case 'hate':
                    hateCount++;
                    break;
            }


        marker = new google.maps.Marker({
            position: {
                lat: initialTweets[i].Latitude,
                lng: initialTweets[i].Longitude
            },
            map: mapTwo,
            animation: google.maps.Animation.DROP,
            title: initialTweets[i].Name + "\n" + initialTweets[i].Text
        });
        markers.push(marker);
        //tweetTable.innerHTML += createTable(initialTweets[i]);
    }

     totalCount = loveCount + familyCount + happyCount + mtvemaCount + funCount+ hateCount;
    hateDivElem.innerHTML = hateCount;
    happyDivElem.innerHTML = happyCount;
    funDivElem.innerHTML = funCount;
    loveDivElem.innerHTML = loveCount;
    familyDivElem.innerHTML = familyCount;
    mtvemaDivElem.innerHTML = mtvemaCount;
    totalCountDivElem.innerHTML = totalCount;
}

function initHeatMap() {
    if (heatmap) {
        heatmap.setMap(null);
    }

    // if (heatmap2) {
    //     heatmap2.setMap(null);
    // }
    // if (heatmap3) {
    //     heatmap3.setMap(null);
    // }

    var heatmapData1 = [];
    array1 = new google.maps.MVCArray(heatmapData1);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: array1,
        map: mapOne
    });

     var heatmapData2 = [];
    array2 = new google.maps.MVCArray(heatmapData2);
    heatmap2 = new google.maps.visualization.HeatmapLayer({
        data: array2,
        map: mapOne
    });
  

     var heatmapData3 = [];
    array3 = new google.maps.MVCArray(heatmapData3);
    heatmap3 = new google.maps.visualization.HeatmapLayer({
        data: array3,
        map: mapOne
    });

    gradient1 = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 225, 255, 1)',
    'rgba(0, 200, 255, 1)',
    'rgba(0, 175, 255, 1)',
    'rgba(0, 160, 255, 1)',
    'rgba(0, 145, 223, 1)',
    'rgba(0, 125, 191, 1)',
    'rgba(0, 110, 255, 1)',
    'rgba(0, 100, 255, 1)',
    'rgba(0, 75, 255, 1)',
    'rgba(0, 50, 255, 1)',
    'rgba(0, 25, 255, 1)',
    'rgba(0, 0, 255, 1)'
    ]
    gradient2 = [
    'rgba(255, 255, 0, 0)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 225, 0, 1)',
    'rgba(255, 200, 0, 1)',
    'rgba(255, 175, 0, 1)',
    'rgba(255, 160, 0, 1)',
    'rgba(255, 145, 0, 1)',
    'rgba(255, 125, 0, 1)',
    'rgba(255, 110, 0, 1)',
    'rgba(255, 100, 0, 1)',
    'rgba(255, 75, 0, 1)',
    'rgba(255, 50, 0, 1)',
    'rgba(255, 25, 0, 1)',
    'rgba(255, 0, 0, 1)'
    ]
    

    for (var i = 0; i < initialTweets.length; i++) {
        array1.push(new google.maps.LatLng(initialTweets[i].Latitude, initialTweets[i].Longitude));
    }

    socket.on('tweet', function(tweet) {
        if (currentKeyword && currentKeyword.toLowerCase() != tweet.Keyword.toLowerCase()) {
            return;
        }
        //console.log(tweet);
        if(tweet.Sentiment.type=="positive")
        {
            heatmap2.set('gradient', gradient1);  
            array2.push(new google.maps.LatLng(tweet.Latitude, tweet.Longitude));
        }else if(tweet.Sentiment.type=="negative")
        {
            heatmap3.set('gradient', gradient2); 
            array3.push(new google.maps.LatLng(tweet.Latitude, tweet.Longitude));
        }
        else if(tweet.Sentiment.type=="neutral")
        {
            array1.push(new google.maps.LatLng(tweet.Latitude, tweet.Longitude));
        }
    });
}

function updateTweetData(key) {
    currentKeyword = key;
    socket.emit('initialTweetsByKeyword', key);
    return false;
}

function createTable(tweet) {
    return "<tr>" +
        "<td>" + tweet.ID + "</td>" +
        "<td>" + tweet.Name + "</td>" +
        "<td>" + tweet.Latitude + "</td>" +
        "<td>" + tweet.Longitude + "</td>" +
        "<td>" + tweet.Text + "</td>" +
        "<td>" + tweet.Keyword + "</td>" +
        "<td>" + tweet.Sentiment.type + "</td>" +
        "</tr>";
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 127, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// function getPoints(tweet) {
//     return [
//         new google.maps.LatLng(tweet.Latitude, tweet.Longitude)
//     ];
// }
