var uluru = {lat: 28.6139, lng: 77.2090};
var AjaxReq,curSummary;
var url;
var endpoint,clientId,parameters;
var Data = [];
var geo = [];

$(document).ready(function () {

    var summaryy = $('#summaryy');
    clientId = 'c5700dde2797fddfaa73f34c12259481/';
    endpoint = 'https://api.darksky.net/forecast/';
    parameters = uluru.lat+','+uluru.lng ;

    url = endpoint + clientId + parameters;

    function AjaxRequest(url , callback){
        console.log('hiiiiii');
        console.log(url);
        $.ajax({ url : url , dataType: 'jsonp' ,success : function (data) {
            callback(data);
        }
        })
    };

    AjaxRequest(url,function (d) {
        Data.push(d);
        //console.log(parameters);
        //console.log(Data[0]);
        var daily = Data[0].currently;
        currentSummary(daily);
    });

    function currentSummary(CS) {
        console.log('Printing');
        console.log(CS);
        console.log('called Current sum');
        summaryy.html('');

        var sum = CS.summary;
        console.log(CS.summary + '5') ;
        var temp = CS.apparentTemperature;
        var humidity = CS.humidity;
        var time = CS.time;

        summaryy.append('<p> <canvas id="icon1" width="128" height="128"></canvas><div class="alert alert-primary"> State : ' + sum + '</div><div class="alert alert-primary"> Humidity : ' + humidity +
            '</div> <div class="alert alert-primary">Temparature : ' + temp + ' °F</div></p>') ;

        var skycons = new Skycons({"color": "#005073"});
        skycons.add("icon1", Skycons[CS.icon]);

        skycons.play();
        if(CS.icon=='clear-day'){
            skycons.set("icon1", Skycons.CLEAR_DAY);
        }
        else if(CS.icon=='clear-night'){
            skycons.set("icon1", Skycons.CLEAR_NIGHT);
        }
        else if(CS.icon=='partly-cloudy-day'){
            skycons.set("icon1", Skycons.PARTLY_CLOUDY_DAY);
        }
        else if(CS.icon=='partly-cloudy-night'){
            skycons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);
        }
        else if(CS.icon=='cloudy'){
            skycons.set("icon1", Skycons.CLOUDY);
        }
        else if(CS.icon=='rain'){
            skycons.set("icon1", Skycons.RAIN);
        }
        else if(CS.icon=='sleet'){
            skycons.set("icon1", Skycons.SLEET);
        }
        else if(CS.icon=='snow'){
            skycons.set("icon1", Skycons.SNOW);
        }
        else if(CS.icon=='wind'){
            skycons.set("icon1", Skycons.WIND);
        }
        else{
            skycons.set("icon1", Skycons.FOG);
        }



        console.log(geo);
        //summary.text(geo);

    }
    AjaxReq = AjaxRequest;
    curSummary = currentSummary;

});


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: uluru
    });

    var prevMerker;

    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });

    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    geocodeLatLng(geocoder, map, infowindow);
    prevMerker = marker;

    google.maps.event.addListener(map, 'click', function(event) {
        console.log('clicked');
        console.log(event);
        //alert(event.latLng);
        uluru.lat = event.latLng.lat();
        uluru.lng = event.latLng.lng();

        if(prevMerker){
            prevMerker.setMap(null);
        }

        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        geocodeLatLng(geocoder, map, infowindow);

        console.log(uluru.lat + ',' + uluru.lng);
        parameters = uluru.lat+','+uluru.lng ;
        url = endpoint + clientId + parameters;

        AjaxReq(url,function (d) {
            Data.length=0;
            Data.push(d);
            //console.log(Data.length);
            //console.log(Data[0]);
            var daily = Data[0].currently;
            curSummary(daily);
        });

        prevMerker = marker;
    });
}

var tempMarker;

function geocodeLatLng(geocoder, map, infowindow) {
    //var input = document.getElementById('latlng').value;
    //var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(uluru.lat), lng: parseFloat(uluru.lng)};
    if(tempMarker){
        tempMarker.setMap(null);
    }
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                //map.setZoom(8);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
                tempMarker = marker;
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}