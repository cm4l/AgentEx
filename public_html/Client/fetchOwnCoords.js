/* This file is part of Friendfind.

 Fetch own coordinates and stores them to the localStorage.

 Needs geolocation. Fallback=fixed coordinate.
*/
function fetchOwnCoords() {
console.log("LOG: fetchOwnCoords called");

if (navigator.geolocation) {
	console.log("LOG: fetchOwnCoords: geolocation works");
	navigator.geolocation.getCurrentPosition(function(position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		//coords = new google.maps.LatLng(latitude, longitude);
		//localStorage.ownCoords=coords;
		//console.log("LOG: stored ownCoords="+coords.toString());

		localStorage.ownLatitude = latitude;
		localStorage.ownLongitude = longitude;
		console.log("LOG: stored ownCoords="+latitude+","+longitude);

	});
}

else {
	console.log("LOG: fetchOwnCoords: geolocation doesn't work");
	alert("Geolocation API is not supported in your browser.");
	
	//Fallback: somewhere near Helsinki-Vantaa Airport
	var latitude = 60.3;
	var longitude = 25;
	localStorage.ownLatitude = latitude;
	localStorage.ownLongitude = longitude;
	console.log("LOG: stored ownCoords="+latitude+","+longitude);
}
		

}

function updateLocation() {
    
    
    
    
    
    
    
    
}
