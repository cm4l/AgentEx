/* This file is part of Friendfind.

 drawMap():
  Draws map containing marks of own and every friend's coordinates.
  Loads coordinates from localStorage.
  Suppose there are element 'mapContainer'

 drawRoute():
  Draws route between own and target's coordinates.
*/
/*globals writeLog, google*/
    var myMarker, targetMarker, map, directionsDisplay;

function moveMyMarkerOnMap(lat, lon) {
    //localStorage.targetLatitude = parseFloat(localStorage.targetLatitude)+0.0001;
    //var coordinates = new google.maps.LatLng(localStorage.targetLatitude, lon);
    var coordinates = new google.maps.LatLng(lat, lon);
    myMarker.setMap(null);
    addMyLocation(coordinates);
    //myMarker.setPosition(coordinates); // this doesnt work for some reason....
    //google.maps.event.trigger(map, 'resize');
}

function addContextMenuForTarget() {
    var contentString = '<div id="markerInfo">' +
        '<p><b>This is the target</b></p>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    //make the infoWindow visible by default
    //infowindow.open(map,marker);
    var contextMenuOptions = {};
    contextMenuOptions.classNames = {
        menu: 'context_menu',
        menuSeparator: 'context_menu_separator'
    };

    //  create an array of ContextMenuItem objects
    //  an 'id' is defined for each of the directions related items
    var menuItems = [];
    menuItems.push({
        className: 'context_menu_item',
        eventName: 'directions_walk_click',
        id: 'directionsWalkItem',
        label: 'Walk'
    });
    menuItems.push({
        className: 'context_menu_item',
        eventName: 'directions_drive_click',
        id: 'directionsDriveItem',
        label: 'Drive'
    });
    contextMenuOptions.menuItems = menuItems;

    var contextMenu = new ContextMenu(map, contextMenuOptions);
    google.maps.event.addListener(targetMarker, 'click', function (mouseEvent) {
        contextMenu.show(mouseEvent.latLng);
        writeLog("map: contextMenu show " + mouseEvent.latLng);
    });

    //  listen for the ContextMenu 'menu_item_selected' event
    google.maps.event.addListener(contextMenu, 'menu_item_selected', function (latLng, eventName) {
        //latLng is in form (60.30990936397909, 25.062280401980388)
        //drop starting and ending parenthesis, comma and space
        var latlon = latLng.toString();
        var latitude_t = latlon.substring(1, latlon.indexOf(","));
        var longitude_t = latlon.substring(latlon.indexOf(",") + 2, latlon.length - 1);

        //writeLog("map: contextMenu item selected2 "+latitude_t+" and "+longitude_t);

        localStorage.targetLatitude = latitude_t;
        localStorage.targetLongitude = longitude_t;

        //lets store the travel mode to local storage
        switch (eventName) {
            case 'directions_walk_click':
                localStorage.calcRouteTravelMode = "Walk";
                break;
            case 'directions_drive_click':
                localStorage.calcRouteTravelMode = "Drive";
                break;
        }

        drawRoute();
    });
}

function addTargetLocation() {
    var targetCoords;
    writeLog("addTargetLocation: lat - " + localStorage.targetLat + " long - " +  localStorage.targetLong);
    targetCoords = new google.maps.LatLng(localStorage.targetLat, localStorage.targetLong);
    targetMarker = new google.maps.Marker({
        position: targetCoords,
        icon: "/images/ownLocation.gif",
        map: map,
        title: "Destroy the Artifact!",
        optimized: false
    });
    addContextMenuForTarget();
}

function addMyLocation(coordinates) {
    myMarker = new google.maps.Marker({
        position: coordinates,
        map: map,
        icon: "/images/hat.png",
        title: "Your current location!",
        optimized: false
    });
}

function drawMap() {
    writeLog("LOG: drawMap called");
    var ownLat, ownLon, coords, mapOptions;
    //Value in localStore is two-value-list (not google.maps.LatLng-object)
    ownLat = localStorage.ownLatitude;
    ownLon = localStorage.ownLongitude;
    coords = new google.maps.LatLng(ownLat, ownLon);

    mapOptions = {
        zoom: 14,
        center: coords,
        mapTypeControl: true,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);
    var rendererOptions = {
        map: map
    };
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    addMyLocation(coords);
    addTargetLocation();
}

//cb=callback. When route is ready, it is passed to this function

function cb_drawmap_route_ready(result) {
    writeLog("cb_route_ready called");

    //this will just work.
    directionsDisplay.setDirections(result);
}

function drawRoute() {
    writeLog("drawRoute called");
    calcRoute(cb_drawmap_route_ready, 1);
}