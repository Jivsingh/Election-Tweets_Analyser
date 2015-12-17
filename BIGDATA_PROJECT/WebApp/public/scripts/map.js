// var map, heatmap, heatmap2,heatmap3;
// var initialTweets;
// var socket;
// var markers = [];
// var tweetTable;
// var mapOne;
// var mapTwo;
// var totalCountDivElem;
// var currentKeyword="";

// function initHeatMapTemp() {
//     mapOne = new google.maps.Map(document.getElementById('heatmap'), {
//         zoom: 1,
//         center: {
//             lat: 37.775,
//             lng: -122.434
//         },
//         mapTypeId: google.maps.MapTypeId.SATELLITE
//     });

//     totalCountDivElem = document.getElementById('totalCount');

//     var myLatLng = {
//         lat: 37.775,
//         lng: -122.434
//     };

//     mapTwo = new google.maps.Map(document.getElementById('map'), {
//         zoom: 1,
//         center: myLatLng,
//         styles: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#EBE5E0"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]}]
//     });

//     var url = window.location.href;
//     var arr = url.split("/");
//     var socketURI = arr[0] + "//" + arr[2]+"/" +arr[3];
//     console.log(socketURI);
//     console.log(arr);

//     socket = io.connect(socketURI);
//     socket.on('connectionSuccessful', function(data) {
//         console.log("conn:" + data);
//     });
  
//     // socket.on('tweetsfromDB', function(data) {
//     //     initialTweets = data;
//     //     //obj = JSON.parse(data);
//     //     console.log("data:", data);
//     //     initMap();
//     //     initHeatMap();
//     // });

//     socket.on('initialTweetsByKeyword', function(data) {
//         initialTweets = data;
//         //obj = JSON.parse(data);
//         console.log("data:", data);
//         initMap();
//         initHeatMap();
//     });
// }

// function initMap() {
//     for (var i = 0; i < markers.length; i++) {
//         markers[i].setMap(null);
//     }

//     var marker;
//     markers = [];
//     var totalCount = initialTweets.length;

//     for (var i = 0; i < initialTweets.length; i++) {
//         if (initialTweets[i].sentiment != null || initialTweets[i].sentiment != undefined) {
//     if (JSON.parse(initialTweets[i].sentiment).type == "positive") {
//         marker = new google.maps.Marker({
//             position: {
//                 lat: initialTweets[i].longitude,
//                 lng: initialTweets[i].latitude
//             },
//             map: mapTwo,
//             animation: google.maps.Animation.DROP,
//             icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
//             title: initialTweets[i].city
//         });
//         markers.push(marker);
//     } else if (JSON.parse(initialTweets[i].sentiment).type == "negative") {
//         marker = new google.maps.Marker({
//             position: {
//                 lat: initialTweets[i].longitude,
//                 lng: initialTweets[i].latitude
//             },
//             map: mapTwo,
//             animation: google.maps.Animation.DROP,
//             icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
//             title: initialTweets[i].city
//         });
//         markers.push(marker);
//     } else if (JSON.parse(initialTweets[i].sentiment).type == "neutral") {
//         marker = new google.maps.Marker({
//             position: {
//                 lat: initialTweets[i].longitude,
//                 lng: initialTweets[i].latitude
//             },
//             map: mapTwo,
//             animation: google.maps.Animation.DROP,
//             icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
//             title: initialTweets[i].city
//         });
//         markers.push(marker);
//     }

        
//         //tweetTable.innerHTML += createTable(initialTweets[i]);
//     }
// }

//     totalCountDivElem.innerHTML = totalCount;
// }

// function initHeatMap() {
//     if (heatmap) {
//         heatmap.setMap(null);
//     }

//     if (heatmap2) {
//         heatmap2.setMap(null);
//     }
//     if (heatmap3) {
//         heatmap3.setMap(null);
//     }

//     var heatmapData1 = [];
//     array1 = new google.maps.MVCArray(heatmapData1);
//     heatmap = new google.maps.visualization.HeatmapLayer({
//         data: array1,
//         map: mapOne
//     });

//      var heatmapData2 = [];
//     array2 = new google.maps.MVCArray(heatmapData2);
//     heatmap2 = new google.maps.visualization.HeatmapLayer({
//         data: array2,
//         map: mapOne
//     });
  

//      var heatmapData3 = [];
//     array3 = new google.maps.MVCArray(heatmapData3);
//     heatmap3 = new google.maps.visualization.HeatmapLayer({
//         data: array3,
//         map: mapOne
//     });

//     gradient1 = [
//     'rgba(0, 255, 255, 0)',
//     'rgba(0, 255, 255, 1)',
//     'rgba(0, 225, 255, 1)',
//     'rgba(0, 200, 255, 1)',
//     'rgba(0, 175, 255, 1)',
//     'rgba(0, 160, 255, 1)',
//     'rgba(0, 145, 223, 1)',
//     'rgba(0, 125, 191, 1)',
//     'rgba(0, 110, 255, 1)',
//     'rgba(0, 100, 255, 1)',
//     'rgba(0, 75, 255, 1)',
//     'rgba(0, 50, 255, 1)',
//     'rgba(0, 25, 255, 1)',
//     'rgba(0, 0, 255, 1)'
//     ]
//     gradient2 = [
//     'rgba(255, 255, 0, 0)',
//     'rgba(255, 255, 0, 1)',
//     'rgba(255, 225, 0, 1)',
//     'rgba(255, 200, 0, 1)',
//     'rgba(255, 175, 0, 1)',
//     'rgba(255, 160, 0, 1)',
//     'rgba(255, 145, 0, 1)',
//     'rgba(255, 125, 0, 1)',
//     'rgba(255, 110, 0, 1)',
//     'rgba(255, 100, 0, 1)',
//     'rgba(255, 75, 0, 1)',
//     'rgba(255, 50, 0, 1)',
//     'rgba(255, 25, 0, 1)',
//     'rgba(255, 0, 0, 1)'
//     ]
    

//     for (var i = 0; i < initialTweets.length; i++) {

//     if (initialTweets[i].sentiment != null || initialTweets[i].sentiment != undefined) {
//     if (JSON.parse(initialTweets[i].sentiment).type == "positive") {
//         heatmap2.set('gradient', gradient1);  
//          array2.push(new google.maps.LatLng(initialTweets[i].longitude, initialTweets[i].latitude));

//     } else if (JSON.parse(initialTweets[i].sentiment).type == "negative") {
//          heatmap3.set('gradient', gradient2); 
//          array3.push(new google.maps.LatLng(initialTweets[i].longitude, initialTweets[i].latitude));
       
//     } else if (JSON.parse(initialTweets[i].sentiment).type == "neutral") {
//         array1.push(new google.maps.LatLng(initialTweets[i].longitude, initialTweets[i].latitude));
//     }
//     }
// }
// }