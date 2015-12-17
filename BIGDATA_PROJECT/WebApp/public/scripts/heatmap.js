var map, heatmap, heatmap2, heatmap3;
var initialTweets;
var socket;
var markers = [];
var tweetTable;
var mapOne;
var mapTwo;
var totalCountDivElem;
var totalCountDivElem;

var currentKeyword = "";

function initHeatMapTemp() {
    mapOne = new google.maps.Map(document.getElementById('heatmap'), {
        zoom: 1,
        center: {
            lat: 37.775,
            lng: -122.434
        },
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    totalCountDivElem = document.getElementById('totalCount');


    var myLatLng = {
        lat: 37.775,
        lng: -122.434
    };

    mapTwo = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: myLatLng,
        styles: [{
            "featureType": "water",
            "stylers": [{
                "saturation": 43
            }, {
                "lightness": -11
            }, {
                "hue": "#0088ff"
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
                "hue": "#ff0000"
            }, {
                "saturation": -100
            }, {
                "lightness": 99
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#808080"
            }, {
                "lightness": 54
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ece2d9"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ccdca1"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#767676"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#EBE5E0"
            }]
        }, {
            "featureType": "poi.park",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.sports_complex",
            "stylers": [{
                "visibility": "on"
            }]
        }]
    });

    var url = window.location.href;
    var arr = url.split("/");
    var socketURI = arr[0] + "//" + arr[1];
    console.log(socketURI);

    socket = io.connect(socketURI);
    socket.on('connectionSuccessful', function(data) {
        console.log("conn:" + data);
    });

    socket.on('tweetsfromDB', function(data) {
        initialTweets = data;
        //obj = JSON.parse(data);
        console.log("data:", data);
        initMap();
        initHeatMap();
    });

    socket.on('initialTweetsByKeyword', function(data) {
        initialTweets = data;
        //obj = JSON.parse(data);
        console.log("data:", data);
        initMap();
        initHeatMap();
    });

    socket.on('Query_tfif', function(data) {
        console.log("The query data", data);
        var chart = AmCharts.makeChart("Query", {
            "theme": "light",
            "type": "serial",
            "dataProvider": [{
                "Person": data[0][0],
                "Relavance": data[0][1]
            }, {
                "Person": data[1][0],
                "Relavance": data[1][1]
            }, {
                "Person": data[2][0],
                "Relavance": data[2][1]
            }, {
                "Person": data[3][0],
                "Relavance": data[3][1]
            }, {
                "Person": data[4][0],
                "Relavance": data[4][1]
            }],
            "valueAxes": [{
                "title": "Relavance"
            }],
            "graphs": [{
                "balloonText": "Income in [[category]]:[[value]]",
                "fillAlphas": 1,
                "lineAlpha": 0.2,
                "title": "Relavance",
                "type": "column",
                "valueField": "Relavance"
            }],
            "depth3D": 20,
            "angle": 30,
            "rotate": true,
            "categoryField": "Person",
            "categoryAxis": {
                "gridPosition": "start",
                "fillAlpha": 0.05,
                "position": "left"
            },
            "export": {
                "enabled": true
            }
        });

        // var DivelemQuery = document.getElementById('Query');
        // DivelemQuery.innerHTML = data;
    });

    socket.on('Sentiment_Users_No', function(data) {
        var chart = AmCharts.makeChart("piechart_3d", {
            "type": "pie",
            "theme": "light",
            "dataProvider": [{
                "Sentiment": "Positive",
                "value": data.positive_key
            }, {
                "Sentiment": "Negative",
                "value": data.negative_key
            }, {
                "Sentiment": "Neutral",
                "value": data.neutral_key
            }],
            "valueField": "value",
            "titleField": "Sentiment",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "export": {
                "enabled": true
            }
        });
        var chart1 = AmCharts.makeChart("piechart_3d1", {
            "type": "pie",
            "theme": "light",
            "dataProvider": [{
                "User Profile": "Very Light Users",
                "value": data.very_light
            }, {
                "User Profile": "Light Users",
                "value": data.light
            }, {
                "User Profile": "Medium Users",
                "value": data.medium
            }, {
                "User Profile": "Heavy Users",
                "value": data.heavy
            }],
            "valueField": "value",
            "titleField": "User Profile",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "export": {
                "enabled": true
            }
        });


    });
    socket.on('HashTags',function(data){
        loadingtoptags(data);
    });
    socket.on('HashTagsByKeyword', function(data) {
        console.log(data);
        loadingtoptags(data);
    });

    socket.on('Graph', function(graph) {
        console.log(graph);
        if (d3) {
            d3.select("#Graphs").select("svg").remove();
        }
        var width = 960,
            height = 500;

        var color = d3.scale.category20();
        var max = 0;
        graph.links.forEach(function(link) {
            if (link.value > max) {
                max = link.value;
            }
        });


        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(function(d) {
                return (max - d.value + 1) * 2;
            })
            .size([width, height]);

        var svg = d3.select("#Graphs").append("svg")
            .attr("width", width)
            .attr("height", height);

        // d3.json("scripts/gh.json", function(error, graph) {
        //   if (error) throw error;

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .style("fill", function(d) {
                return color(d.group);
            })
            .call(force.drag);

        node.append("title")
            .text(function(d) {
                return d.name;
            });


        force.on("tick", function() {
            link.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node.attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        });
        // });

    });

    socket.on('Sentiment_Users', function(data) {
        var chart = AmCharts.makeChart("piechart_3d", {
            "type": "pie",
            "theme": "light",
            "dataProvider": [{
                "Sentiment": "Positive",
                "value": data.positive_key
            }, {
                "Sentiment": "Negative",
                "value": data.negative_key
            }, {
                "Sentiment": "Neutral",
                "value": data.neutral_key
            }],
            "valueField": "value",
            "titleField": "Sentiment",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "export": {
                "enabled": true
            }
        });
        var chart1 = AmCharts.makeChart("piechart_3d1", {
            "type": "pie",
            "theme": "light",
            "dataProvider": [{
                "User Profile": "Very Light Users",
                "value": data.very_light
            }, {
                "User Profile": "Light Users",
                "value": data.light
            }, {
                "User Profile": "Medium Users",
                "value": data.medium
            }, {
                "User Profile": "Heavy Users",
                "value": data.heavy
            }],
            "valueField": "value",
            "titleField": "User Profile",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "export": {
                "enabled": true
            }
        });

    });

}

function initMap() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    var marker;
    markers = [];
    var totalCount = initialTweets.length;

    for (var i = 0; i < initialTweets.length; i++) {
        if (initialTweets[i].sentiment != null || initialTweets[i].sentiment != undefined) {
            if (JSON.parse(initialTweets[i].sentiment).type == "positive") {
                marker = new google.maps.Marker({
                    position: {
                        lat: initialTweets[i].longitude,
                        lng: initialTweets[i].latitude
                    },
                    map: mapTwo,
                    animation: google.maps.Animation.DROP,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    title: initialTweets[i].city
                });
                markers.push(marker);
            } else if (JSON.parse(initialTweets[i].sentiment).type == "negative") {
                marker = new google.maps.Marker({
                    position: {
                        lat: initialTweets[i].longitude,
                        lng: initialTweets[i].latitude
                    },
                    map: mapTwo,
                    animation: google.maps.Animation.DROP,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    title: initialTweets[i].city
                });
                markers.push(marker);
            } else if (JSON.parse(initialTweets[i].sentiment).type == "neutral") {
                marker = new google.maps.Marker({
                    position: {
                        lat: initialTweets[i].longitude,
                        lng: initialTweets[i].latitude
                    },
                    map: mapTwo,
                    animation: google.maps.Animation.DROP,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                    title: initialTweets[i].city
                });
                markers.push(marker);
            }


            //tweetTable.innerHTML += createTable(initialTweets[i]);
        }
    }

    totalCountDivElem.innerHTML = totalCount;
}

function initHeatMap() {
    if (heatmap) {
        heatmap.setMap(null);
    }

    if (heatmap2) {
        heatmap2.setMap(null);
    }
    if (heatmap3) {
        heatmap3.setMap(null);
    }

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
        'rgba(255, 75, 0, 1)',
        'rgba(255, 50, 0, 1)',
        'rgba(255, 25, 0, 1)',
        'rgba(255, 0, 0, 1)'
    ]

    gradient3 = [
        'rgba(255, 255, 0, 0)',
        'rgba(255, 255, 0, 1)',
        'rgba(255, 225, 0, 1)',
        'rgba(255, 200, 0, 1)',
        'rgba(255, 175, 0, 1)',
        'rgba(255, 160, 0, 1)',
        'rgba(255, 145, 0, 1)',
        'rgba(255, 125, 0, 1)',
        'rgba(255, 110, 0, 1)',
        'rgba(255, 100, 0, 1)'
    ]

    gradient4 = [
        'rgba(0, 255, 0, 0)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 225, 0, 1)',
        'rgba(0, 200, 0, 1)',
        'rgba(0, 175, 0, 1)',
        'rgba(0, 160, 0, 1)',
        'rgba(0, 145, 0, 1)',
        'rgba(0, 125, 0, 1)',
        'rgba(0, 110, 0, 1)',
        'rgba(0, 100, 0, 1)'
    ]


    for (var i = 0; i < initialTweets.length; i++) {

        if (initialTweets[i].sentiment != null || initialTweets[i].sentiment != undefined) {
            if (JSON.parse(initialTweets[i].sentiment).type == "positive") {
                heatmap2.set('gradient', gradient1);
                array2.push(new google.maps.LatLng(initialTweets[i].longitude, initialTweets[i].latitude));

            } else if (JSON.parse(initialTweets[i].sentiment).type == "negative") {
                heatmap3.set('gradient', gradient2);
                array3.push(new google.maps.LatLng(initialTweets[i].longitude, initialTweets[i].latitude));

            } else if (JSON.parse(initialTweets[i].sentiment).type == "neutral") {
                array1.push(new google.maps.LatLng(initialTweets[i].longitude, initialTweets[i].latitude));
            }
        }
    }
}

function loadingimageonkeyword(key) {
    if (key == "Hillary Clinton") {
        document.getElementById("myImg").src = "images/Hillary.png";
    }
    if (key == "Donald Trump") {
        document.getElementById("myImg").src = "images/Trump.png";
    }
    if (key == "Ben Carson") {
        document.getElementById("myImg").src = "images/Carson.png";
    }
    if (key == "Bernie Sanders") {
        document.getElementById("myImg").src = "images/Sanders.png";
    }
    if (key == "Ted Cruz") {
        document.getElementById("myImg").src = "images/Ted.png";
    }

}

function loadingtoptags(freqlist) {
    if (d3) {
        d3.select("#TopHashTags").select("svg").remove();
    }
    var frequency_list = freqlist;

    var color = d3.scale.linear()
        .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

    d3.layout.cloud().size([700, 300])
        .words(frequency_list)
        .rotate(0)
        .fontSize(function(d) {
            return d.size;
        })
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select("#TopHashTags").append("svg")
            .attr("width", 850)
            .attr("height", 350)
            .attr("class", "wordcloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(320,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) {
                return d.size + "px";
            })
            .style("fill", function(d, i) {
                return color(i);
            })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) {
                return d.text;
            });
    }
}

function querydata(key) {
    socket.emit('Query_tfif', key);
}

$(document).ready(function() {
    $('#relevanceBtn').click(function() {
        console.log('Haha');
        var keyword = $('#relevanceWordInput').val();
        console.log(keyword);
        if (keyword) {
            keyword = keyword.trim();
            querydata(keyword);
        }
    });
});

function updateTweetData(key) {
    currentKeyword = key;
    loadingimageonkeyword(key);
    //loadingtoptags(key);
    socket.emit('HashTagsByKeyword', key);
    socket.emit('initialTweetsByKeyword', key);
    socket.emit('Sentiment_Users', key);
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
