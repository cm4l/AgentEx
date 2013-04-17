/*globals writeLog, moveMyMarkerOnMap*/
//distance in kilometres
var ALERT_DISTANCE = 0.1;
var proximityNotified = false;
var targetInProximity= false;

function calcDistance(lat1, lon1, lat2, lon2) {
    var deg2rad = Math.PI / 180;

    var R = 6371; // km
    //var dLat = (lat2-lat1).toRad();
    var dLat = (lat2 - lat1) * deg2rad;
    //var dLon = (lon2-lon1).toRad();
    var dLon = (lon2 - lon1) * deg2rad;
    //var lat1 = lat1.toRad();
    var lat1 = lat1 * deg2rad;
    //var lat2 = lat2.toRad();
    var lat2 = lat2 * deg2rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;

}

function playProximityAlert() {
    if (!proximityNotified) {
        writeLog("Play sound!");
        var sound = new Audio("audio/9695__suonho__suonho-scaryscape-01.wav");
        sound.play();
        targetInProximity=true;
        proximityNotified = true; //for not playing the sound too many
    }
}

function checkDistance(playerLat, playerLon) {
    var targetLat, targetLon, distance;
    targetLat = $('#targetLat').val();
    targetLon = $('#targetLong').val();
    distance = calcDistance(playerLat, playerLon, targetLat, targetLon);
    writeLog("targetLat: " + targetLat + " targetLon: " + targetLon + " distance: " + distance);

    if (distance < ALERT_DISTANCE) {
        playProximityAlert();
    } else {
        proximityNotified = false;
    }
}

function updateLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude, longitude;
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        localStorage.ownLatitude = latitude;
        localStorage.ownLongitude = longitude;
        writeLog("updated ownCoords=" + latitude + "," + longitude);
        checkDistance(latitude, longitude);
        if (isElementVisible('cam')){
            moveMyMarkerOnMap(latitude, longitude);
        };
    });
}

function trackOwnCoords() {
    writeLog("LOG: fetchAndFollowOwnCoords called");

    if (navigator.geolocation) {
        writeLog("LOG: fetchOwnCoords: geolocation works");
        updateLocation();
        setInterval(function () {
            updateLocation();
        }, 6000); //6 seconds
    } else {
        writeLog("fetchOwnCoords: geolocation doesn't work");
        alert("Geolocation API is not supported in your browser.");

        //Fallback: somewhere near Helsinki-Vantaa Airport
        var latitude = 60.3,
            longitude = 25;
        localStorage.ownLatitude = latitude;
        localStorage.ownLongitude = longitude;
        writeLog("LOG: stored ownCoords=" + latitude + "," + longitude);
    }
}