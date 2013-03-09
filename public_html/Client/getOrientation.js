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
                
                if (Modernizr.localstorage) {
                    // window.localStorage is available!
                    console.log("localstorage supported by browser");
                } else {
                    console.log("localstorage NOT supported by browser");
                    // no native support for local storage :(
                    // maybe try Gears or another third-party solution
                }

		//add listener
              
                   
		window.addEventListener('deviceorientation', orientation, false);                    
                
                
                
                
                
	} else {
		console.log("DeviceOrientation is not supported");
	}


            


}
function orientation(event) {
			// gamma is the left-to-right tilt in degrees, where right is positive
                        // console.log("Deviceorientation event triggered");
                        
                        try {

                        //console.log(event.beta);
			//if ( eventData.gamma != null) //e.g. chrome on desktop sends null if there are no sensors
                                if (navigator.appName = 'Opera'){
                                    //localStorage.orientationGammaX =  event.alpha;
                                    localStorage.orientationGammaX =  event.gamma;
                                }else{
                                
                                    localStorage.orientationGammaX =  event.gamma;
                                }
			// beta is the front-to-back tilt in degrees, where front is positive
			//if (eventData.beta != null)
                                if (navigator.appName = 'Opera'){
                                    localStorage.orientationBetaY =  event.beta;
                                }else{
				localStorage.orientationBetaY = event.beta;
                                }
			// alpha is the compass direction the device is facing in degrees
			//if (eventData.alpha != null)
                                if (navigator.appName = 'Opera'){
                                    localStorage.orientationAlphaCompass =  event.alpha;
                                }else{
				localStorage.orientationAlphaCompass = event.alpha;
                                }
                            
                        //we will only start this update after the user is logged in bu twe have to initialize the orientation for it to work on OPERA
                        
                        if (localStorage.userLoggedIn == "1"){
// for debugging: show values
                                if (isElementVisible('cam')){
                                       setInterval(function(){route3dUpdateCameraPosition();},1000);
                                }

                                orientationDataToHTML();
                                //lets see if localstorage is the problem
                                document.getElementById('GammaX').innerHTML = event.gamma;
                                document.getElementById('BetaY').innerHTML = event.beta;
                                document.getElementById('AlphaC').innerHTML = event.alpha;
                                        //swap section based on new orientation
                                sectionChangeOnOrientationChange();
                        
                            }
                        }
                        catch(err){
                        console.log("DeviceOrientation error: "+err.message);
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

	if ( o>75 ) {
		if (!isElementVisible('cam')){
			showElement('cam');
			hideElement('map');
			webCam();
		}
	} else if (o<15) {
		if (!isElementVisible('map')) {
			showElement('map');
			hideElement('cam');
			drawMap();
		}
	}
}
