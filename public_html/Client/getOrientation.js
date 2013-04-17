/* This file is part of Friendfind.

 Adds orientation event listener to window. 
 Orientation of the device is stored in localStorage here,
*/
/*globals  writeLog */

function setOrientationListener() {
    writeLog("setOrientationListener called");

    //debug: add keyboard handler to simulate sensors
    document.onkeydown = handleKeyPresses;
    writeLog("debug: keyboard listener added");

    if (window.DeviceOrientationEvent) {
        writeLog("browser/device claims to support orientation events");


        //add listener


        window.addEventListener('deviceorientation', orientation, false);


    } else {
        writeLog("DeviceOrientation is not supported");
    }
}

function orientation(event) {
    // gamma is the left-to-right tilt in degrees, where right is positive
    // writeLog("Deviceorientation event triggered");

    try {

        //writeLog(event.beta);
        //if ( eventData.gamma != null) //e.g. chrome on desktop sends null if there are no sensors
        if (navigator.appName = 'Opera') {
            //localStorage.orientationGammaX =  event.alpha;
            localStorage.orientationGammaX = event.beta;
        } else {

            localStorage.orientationGammaX = event.gamma;
        }
        // beta is the front-to-back tilt in degrees, where front is positive
        //if (eventData.beta != null)
        if (navigator.appName = 'Opera') {
            localStorage.orientationBetaY = event.gamma;
        } else {
            localStorage.orientationBetaY = event.beta;
        }
        // alpha is the compass direction the device is facing in degrees
        //if (eventData.alpha != null)
        if (navigator.appName = 'Opera') {
            localStorage.orientationAlphaCompass = event.alpha;
        } else {
            localStorage.orientationAlphaCompass = event.alpha;
        }

        //we will only start this update after the user is logged in bu twe have to initialize the orientation for it to work on OPERA

        if (localStorage.userLoggedIn == "1") {
            // for debugging: show values
            if (isElementVisible('cam')) {
                
                    ar_updateCameraPosition();
                    //writeLog("Camera position updated");
                   
            }

            orientationDataToHTML();
            //
            //lets see if localstorage is the problem
            //document.getElementById('GammaX').innerHTML = event.gamma;
            //document.getElementById('BetaY').innerHTML = event.beta;
            //document.getElementById('AlphaC').innerHTML = event.alpha;
            //swap section based on new orientation
            //sectionChangeOnOrientationChange(); //removed automatic section change / now only manual

        }
    } catch (err) {
        writeLog("DeviceOrientation error: " + err.message);
    }


}
/*
 This is for debugging.
*/
function handleKeyPresses(evt) {
    //Do not pass event forward: i.e. arrows do not move page, 'search when type' will not trigger and so on.
    evt.preventDefault();

    var evt = (evt) ? evt : ((event) ? event : null);
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    switch (evt.keyCode) {
        case 37:
            writeLog("left");
            localStorage.ownLatitude = parseFloat(localStorage.ownLatitude) + 0.1;
            break;
        case 39:
            writeLog("right");
            localStorage.ownLatitude = parseFloat(localStorage.ownLatitude) - 0.1;
            break;
        case 38:
            writeLog("up");
            localStorage.ownLongitude = parseFloat(localStorage.ownLongitude) + 0.1;
            break;
        case 40:
            writeLog("down");
            localStorage.ownLongitude = parseFloat(localStorage.ownLongitude) - 0.1;
            break;

        case 65:
            writeLog("a");
            localStorage.orientationAlphaCompass = parseFloat(localStorage.orientationAlphaCompass) + 1;
            break;
        case 68:
            writeLog("d");
            localStorage.orientationAlphaCompass = parseFloat(localStorage.orientationAlphaCompass) - 1;
            break;
        case 87:
            writeLog("w");
            localStorage.orientationGammaX = parseFloat(localStorage.orientationGammaX) + 1;
            break;
        case 83:
            writeLog("s");
            localStorage.orientationGammaX = parseFloat(localStorage.orientationGammaX) - 1;
            break;
        case 81:
            writeLog("q");
            localStorage.orientationBetaY = parseFloat(localStorage.orientationBetaY) + 1;
            break;
        case 69:
            writeLog("e");
            localStorage.orientationBetaY = parseFloat(localStorage.orientationBetaY) - 1;
            break;

        default:
            //writeLog("evt.keyCode "+evt.keyCode );
            break;
    }

    ar_updateCameraPosition();
    //orientationDataToHTML();
    sectionChangeOnOrientationChange();
}


//For debugging: show values

function orientationDataToHTML() {
    /*
    writeLog(" debug: sensor values");
    writeLog("gammaX="+localStorage.orientationGammaX);
    writeLog("betaY="+localStorage.orientationBetaY);
    writeLog("alphaC="+localStorage.orientationAlphaCompass);
    writeLog("latitude="+localStorage.ownLatitude);
    writeLog("longitude="+localStorage.ownLongitude);
    */

    document.getElementById("GammaX").innerHTML = localStorage.orientationGammaX;
    document.getElementById("BetaY").innerHTML = localStorage.orientationBetaY;
    document.getElementById("AlphaC").innerHTML = localStorage.orientationAlphaCompass;
    document.getElementById("Latitude").innerHTML = localStorage.ownLatitude;
    document.getElementById("Longitude").innerHTML = localStorage.ownLongitude;
}


function sectionChangeOnOrientationChange() {
    writeLog("sectionChangeOnOrientationChange called");
    var o = parseInt(localStorage.orientationGammaX);
    //writeLog("orientation:"+o);
    //writeLog("map="+isElementVisible('map'));
    //writeLog("cam="+isElementVisible('cam'));
    if (!isElementVisible('cam') && !isElementVisible('map')) {
        //if nothing is visible /might happend in the beginning
        showElement('map');
        drawMap();
    }

    if (o > 75) {
        if (!isElementVisible('cam')) {
            showElement('cam');
            hideElement('map');
            webCam();
        }
    } else if (o < 15) {
        if (!isElementVisible('map')) {
            showElement('map');
            hideElement('cam');
            drawMap();
        }
    }
}