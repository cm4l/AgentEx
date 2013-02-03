/* This file is part of Friendfind.

 Adds orientation event listener to window. 
 Orientation of the device is stored in localStorage here,
*/

function getOrientation(){
	console.log("getOrientation called");

	//debug: add keyboard handler to simulate sensors
	document.onkeydown = handleKeyPresses;
	console.log("debug: keyboard listener added");
    
	if (window.DeviceOrientationEvent) {
		console.log("browser/device claims to support orientation events");

		//add listener
		window.addEventListener('deviceorientation', function(eventData) {
			// gamma is the left-to-right tilt in degrees, where right is positive
			// console.log("Deviceorientation event triggered");
			if ( eventData.gamma != null) //e.g. chrome on desktop sends null if there are no sensors
			        localStorage.orientationGammaX =  eventData.gamma;

			// beta is the front-to-back tilt in degrees, where front is positive
			if (eventData.beta != null)
				localStorage.orientationBetaY = eventData.beta;

			// alpha is the compass direction the device is facing in degrees
			if (eventData.alpha != null)
				localStorage.orientationAlphaCompass = eventData.alpha;
        
			// for debugging: show values
			orientationDataToHTML();

			//swap section based on new orientation
			sectionChangeOnOrientationChange();

		}, false);
	} else {
		console.log("DeviceOrientation is not supported");
	}


}

/*
 This is for debugging.
*/
function handleKeyPresses(evt) {
        //Do not pass event forward: i.e. arrows do not move page, 'search when type' will not trigger and so on.
        evt.preventDefault();

        var evt  = (evt) ? evt : ((event) ? event : null);
        var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
        switch(evt.keyCode) {
        case 37:
		console.log("left");
		localStorage.ownLatitude = parseFloat(localStorage.ownLatitude) + 0.1;
		break;
        case 39:
		console.log("right");
		localStorage.ownLatitude = parseFloat(localStorage.ownLatitude) - 0.1;
		break;
        case 38:
		console.log("up");
		localStorage.ownLongitude = parseFloat(localStorage.ownLongitude) + 0.1;
		break;
        case 40:
		console.log("down");
		localStorage.ownLongitude = parseFloat(localStorage.ownLongitude) - 0.1;
		break;

	case 65:
		console.log("a");
		localStorage.orientationAlphaCompass = parseFloat(localStorage.orientationAlphaCompass) + 1;
		break;
	case 68:
		console.log("d");
		localStorage.orientationAlphaCompass = parseFloat(localStorage.orientationAlphaCompass) - 1;
		break;
	case 87:
		console.log("w");
		localStorage.orientationGammaX = parseFloat(localStorage.orientationGammaX) + 1;
		break;
	case 83:
		console.log("s");
		localStorage.orientationGammaX = parseFloat(localStorage.orientationGammaX) - 1;
		break;
	case 81:
		console.log("q");
		localStorage.orientationBetaY = parseFloat(localStorage.orientationBetaY) + 1;
		break;
	case 69:
		console.log("e");
		localStorage.orientationBetaY = parseFloat(localStorage.orientationBetaY) - 1;
		break;

	default:
		//console.log("evt.keyCode "+evt.keyCode );
		break;
	}

	route3dUpdateCameraPosition();
	orientationDataToHTML();
	sectionChangeOnOrientationChange();
}



//For debugging: show values
function orientationDataToHTML(){
	/*
	console.log(" debug: sensor values");
	console.log("gammaX="+localStorage.orientationGammaX);
	console.log("betaY="+localStorage.orientationBetaY);
	console.log("alphaC="+localStorage.orientationAlphaCompass);
	console.log("latitude="+localStorage.ownLatitude);
	console.log("longitude="+localStorage.ownLongitude);
	*/

	document.getElementById("GammaX").innerHTML = localStorage.orientationGammaX;
	document.getElementById("BetaY").innerHTML = localStorage.orientationBetaY;
	document.getElementById("AlphaC").innerHTML = localStorage.orientationAlphaCompass;
	document.getElementById("Latitude").innerHTML = localStorage.ownLatitude;
	document.getElementById("Longitude").innerHTML = localStorage.ownLongitude;
}


function sectionChangeOnOrientationChange(){
	console.log("sectionChangeOnOrientationChange called");
	var o = parseInt(localStorage.orientationGammaX);
	//console.log("orientation:"+o);
	//console.log("map="+isElementVisible('map'));
	//console.log("cam="+isElementVisible('cam'));

	if ( o>-45 ) {
		if (!isElementVisible('cam')){
			showElement('cam');
			hideElement('map');
			webCam();
		}
	} else {
		if (!isElementVisible('map')) {
			showElement('map');
			hideElement('cam');
			drawMap();
		}
	}
}
