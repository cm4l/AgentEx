/*globals writeLog*/

window.onerror = function (message, url, linenumber) {
    writeLog("JavaScript error: " + message + " on line " + linenumber + " for " + url);
};

function isElementVisible(id) {
    if ($('#' + id).hasClass('hidden')) {
        return false;
    }
    return true;
}

function showElement(id) {
    $('#' + id).removeClass('hidden');
}

function hideElement(id) {
    if (!$('#' + id).hasClass('hidden')) {
        $('#' + id).addClass('hidden');
    }
}

function homePressed() {
    localStorage.userLoggedIn = "0";
    hideElement('map');
    hideElement('cam');
    hideElement('menuToggleSection');
    hideElement('sideMenuSection');

    showElement('home');
}

function cameraPressed() {
    hideElement('home');
    hideElement('map');
    showElement('cam');
    showElement('menuToggleSection');
    webCam();
}

function mapPressed() {
    hideElement('home');
    hideElement('cam');
    showElement('map');
    showElement('menuToggleSection');
    drawMap();
}

function toGame() {
    localStorage.userLoggedIn = "1";
    //showElement('debug_status');
    mapPressed();
    document.getElementById("menuToggle").style.backgroundImage = "url('images/showmenu_button.png')";
}

function congratulate() {
    hideElement('home');
    hideElement('cam');
    hideElement('map');
    showElement('congratulations');
}

function storeTargetCoordinates() {
    var lat, lon;
    lat = $('#targetLat').val();
    lon = $('#targetLong').val();
    writeLog("storeTargetCoordinates: " + lat + lon);
    localStorage.targetLong = lon;
    localStorage.targetLat = lat;
}


function start() {
    writeLog("<check> Main.html loaded successfully");
    localStorage.userLoggedIn = "0"; //nollataan tässä     
    var id = Math.random();
    storeTargetCoordinates();
    
    trackOwnCoords();
    //startCommunication(id);
    localStorage.sessionId = id;
    setOrientationListener();
    ar_initScene();
}

function loginPressed() {

    localStorage.userLoggedIn = "1";

    //writeLog("LoginPressed");
    hideElement('home');
    hideElement('cam');
    showElement('map');
    showElement('menuToggleSection');
    showElement('debug_status');
    //showElement('sideMenu');


    var formfield = document.theForm.group1;
    var startingOrientation = "default";
    for (i = 0; i < formfield.length; i++)
    if (formfield[i].checked == true) startingOrientation = formfield[i].value;
    //writeLog(startingOrientation);
    //getOrientation();

    //This is the default case (we just trust sensors and getOrientation)
    if (startingOrientation == 'sensor') {
        return;
    }

    // These are useful if there are no sensors (even browser claims to support them)
    if (startingOrientation == 'map') {
        localStorage.orientationGammaX = -50;
    } else {
        localStorage.orientationGammaX = -40;
    }

    //some sane default values
    localStorage.orientationAlphaCompass = 0; //look to the north
    localStorage.orientationBetaY = 0; //suppose screen is landscaped

    //sectionChangeOnOrientationChange();
    //orientationDataToHTML();
}

function runMenuToggle() {
    if (isElementVisible('sideMenuSection')) {
        hideElement('sideMenuSection');
        document.getElementById("menuToggle").style.backgroundImage = "url('images/showmenu_button.png')";
    } else {
        showElement('sideMenuSection');
        document.getElementById("menuToggle").style.backgroundImage = "url('images/hidemenu_button.png')";
    }
}

$(document).ready(function () {
    start();
});