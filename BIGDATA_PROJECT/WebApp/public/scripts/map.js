console.log("inside map.js");

// // Note: This example requires that you consent to location sharing when
// // prompted by your browser. If you see the error "The Geolocation service
// // failed.", it means you probably did not give permission for the browser to
// // locate you.

// function initMap1() {

//     var hateDivElem = document.getElementById('hateCount');
//     var happyDivElem = document.getElementById('happyCount');
//     var funDivElem = document.getElementById('funCount');
//     var loveDivElem = document.getElementById('loveCount');
//     var familyDivElem = document.getElementById('familyCount');
//     var mtvemaDivElem = document.getElementById('mtvemaCount');
//     //var tweetTable = document.getElementById('tweettable');
//     var totalCountDivElem = document.getElementById('totalCount');

//     var myLatLng = {
//         lat: -25.363,
//         lng: 131.044
//     };

//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 1,
//         center: myLatLng
//     });

//     var socket = io.connect('http://localhost:3000');
//     socket.on('connectionSuccessful', function(data) {
//         console.log(data);
//     });

//     socket.on('initialTweets', function(tweets) {

//         var funCount = 0;
//         var familyCount = 0;
//         var happyCount = 0;
//         var mtvemaCount = 0;
//         var loveCount = 0;
//         var hateCount = 0;
//         var totalCount = 0;

//         for (var i = 0; i < tweets.length; i++) {

//             switch (tweets[i].Keyword.toLowerCase()) {
//                 case 'love':
//                     loveCount++;
//                     break;
//                 case 'family':
//                     familyCount++;
//                     break;
//                 case 'happy':
//                     happyCount++;
//                     break;
//                 case 'mtvema':
//                     mtvemaCount++;
//                     break;
//                 case 'fun':
//                     funCount++;
//                     break;
//                 case 'hate':
//                     hateCount++;
//                     break;
//             }
//             new google.maps.Marker({
//                 position: {
//                     lat: tweets[i].Latitude,
//                     lng: tweets[i].Longitude
//                 },
//                 map: map,
//                 animation: google.maps.Animation.DROP,
//                 title: tweets[i].Name + "\n" + tweets[i].Text
//             });
//         }
//         totalCount = loveCount + familyCount + happyCount + mtvemaCount + funCount+ hateCount;
//         hateDivElem.innerHTML = hateCount;
//         happyDivElem.innerHTML = happyCount;
//         funDivElem.innerHTML = funCount;
//         loveDivElem.innerHTML = loveCount;
//         familyDivElem.innerHTML = familyCount;
//         mtvemaDivElem.innerHTML = mtvemaCount;
//         totalCountDivElem.innerHTML = totalCount;
//     });

//     socket.on('tweet', function(tweet) {

//         var tweettablerow = "<tr>" +
//             "<td>" + tweet.ID + "</td>" +
//             "<td>" + tweet.Name + "</td>" +
//             "<td>" + tweet.Latitude + "</td>" +
//             "<td>" + tweet.Longitude +"</td>" +
//             "<td>" + tweet.Text +"</td>" +
//             "<td>" + tweet.Keyword +"</td>" +
//             "</tr>";

//         switch (tweet.Keyword.toLowerCase()) {
//             case 'love':
//                 loveDivElem.innerHTML = parseInt(loveDivElem.innerHTML) + 1;
//                 break;
//             case 'family':
//                 familyDivElem.innerHTML = parseInt(familyDivElem.innerHTML) + 1;
//                 break;
//             case 'happy':
//                 happyDivElem.innerHTML = parseInt(happyDivElem.innerHTML) + 1;
//                 break;
//             case 'mtvema':
//                 mtvemaDivElem.innerHTML = parseInt(mtvemaDivElem.innerHTML) + 1;
//                 break;
//             case 'fun':
//                 funDivElem.innerHTML = parseInt(funDivElem.innerHTML) + 1;
//                 break;
//             case 'hate':
//                 hateDivElem.innerHTML = parseInt(hateDivElem.innerHTML) + 1;
//                 break;
//         }

//          totalCountDivElem.innerHTML = parseInt(totalCountDivElem.innerHTML) + 1;
//         tweetTable.innerHTML += tweettablerow;

//         console.log(tweet);
//         new google.maps.Marker({
//             position: {
//                 lat: tweet.Latitude,
//                 lng: tweet.Longitude
//             },
//             map: map,
//             animation: google.maps.Animation.BOUNCE,
//             title: tweet.Name + "\n" + tweet.Text
//         });
//     });
// }
