/* This file is part of Friendfind.

 Fetch own coordinates and stores them to the localStorage.

 Needs geolocation. Fallback=fixed coordinate.
*/
/*globals writeLog*/

function updateLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        localStorage.ownLatitude = latitude;
        localStorage.ownLongitude = longitude;
        writeLog("updated ownCoords=" + latitude + "," + longitude);
    });
}

function fetchAndFollowOwnCoords() {
    writeLog("LOG: fetchAndFollowOwnCoords called");

    if (navigator.geolocation) {
        writeLog("LOG: fetchOwnCoords: geolocation works");
        updateLocation();
        setInterval(function () {
            updateLocation();
        }, 6000 ); //6 seconds
    } else {
        writeLog("fetchOwnCoords: geolocation doesn't work");
        alert("Geolocation API is not supported in your browser.");

        //Fallback: somewhere near Helsinki-Vantaa Airport
        var latitude = 60.3;
        var longitude = 25;
        localStorage.ownLatitude = latitude;
        localStorage.ownLongitude = longitude;
        writeLog("LOG: stored ownCoords=" + latitude + "," + longitude);
    }
}