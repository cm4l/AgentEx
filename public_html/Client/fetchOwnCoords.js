/* This file is part of Friendfind.

 Fetch own coordinates and stores them to the localStorage.

 Needs geolocation. Fallback=fixed coordinate.
*/
/*globals writeLog*/

function fetchOwnCoords() {
writeLog("LOG: fetchOwnCoords called");

if (navigator.geolocation) {
	writeLog("LOG: fetchOwnCoords: geolocation works");
	navigator.geolocation.getCurrentPosition(function(position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		//coords = new google.maps.LatLng(latitude, longitude);
		//localStorage.ownCoords=coords;
		//writeLog("LOG: stored ownCoords="+coords.toString());

		localStorage.ownLatitude = latitude;
		localStorage.ownLongitude = longitude;
		writeLog("LOG: stored ownCoords="+latitude+","+longitude);

	});
}

else {
	writeLog("LOG: fetchOwnCoords: geolocation doesn't work");
	alert("Geolocation API is not supported in your browser.");
	
	//Fallback: somewhere near Helsinki-Vantaa Airport
	var latitude = 60.3;
	var longitude = 25;
	localStorage.ownLatitude = latitude;
	localStorage.ownLongitude = longitude;
	writeLog("LOG: stored ownCoords="+latitude+","+longitude);
}
		

}

function updateLocation() {
    
    
    
    
    
    
    
    
}
