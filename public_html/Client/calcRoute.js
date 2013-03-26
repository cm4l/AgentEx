/* This file is part of Friendfind.
 
 calcRoute doesn't take parameters, but fetches ownCoords and targetCoords from localStorage.
  (targetCoords is coordinates of one friend)

 When calcRoute is ready, it will call 'callback_function'. 
 'mode' is used to determine what caller is expecting to get as parameter for callback
 mode=1 => DirectionsResult (can be used straight with DirectionsRenderer)
 mode=2 => array with coordinate-pairs (pair= two-slot-array containing two floats)

 travelMode attribute will be used to calc the route using wanted mode
  will be either walk or drive (others can be added later - like public transport(TRANSIT) or BICYCLING) 
  is loaded from localStorage
*/

/*globals writeLog*/

function calcRoute(callback_function,mode) {
writeLog("LOG: function:calcRoute called");

var directionsService = new google.maps.DirectionsService();
var start = new google.maps.LatLng(localStorage.ownLatitude, localStorage.ownLongitude);
var end = new google.maps.LatLng(localStorage.targetLatitude, localStorage.targetLongitude);

/* TODO: error checking
if start =="undefined" {
	start = ;}
if end =="undefined" {
	end = ;}
*/

//lets see what travelmode user wants for the route
var travelModeGoogleStyle = google.maps.TravelMode.DRIVING;
if (localStorage.calcRouteTravelMode == "Walk") {
	//writeLog("calcRoute: travelmode=walk");
	travelModeGoogleStyle = google.maps.TravelMode.WALKING;
}
else if (localStorage.calcRouteTravelMode == "Drive") {
	//writeLog("calcRoute: travelmode=drive");
	travelModeGoogleStyle = google.maps.TravelMode.DRIVING;
}

var request = {
	origin:start,
	destination:end,
	travelMode: travelModeGoogleStyle
};
	
directionsService.route(request, function(result, status) {
	if (status == google.maps.DirectionsStatus.OK) {
		writeLog("calcRoute: ready.");

		if (mode==1) {
			callback_function(result);
		}
		else if (mode==2) {
			var overviewP = result.routes[0].overview_path;
			var array = new Array();
			for (x in overviewP) {
				var ovp = overviewP[x].toString();
				//ovp is now "(lat, lon)"
				var lat = parseFloat(ovp.substring(1,ovp.indexOf(",")));
				var lon = parseFloat(ovp.substring(ovp.indexOf(",")+2,ovp.length-1));
				//writeLog("lat is "+lat);
				//writeLog("lon is "+lon);

				//entries of 'array' are two-slot-arrays containing two floats
				array.push([lat,lon]);
			}
			callback_function(array);
		}
		else {
			writeLog("calcRoute: got route, but didn't know what to do for it");
		}

	} //end of DirectionsStatus.OK
	else {
		writeLog("calcRoute: Didn't get route");
	}
}); //end of directionsService.route

} //end of function calcRoute
