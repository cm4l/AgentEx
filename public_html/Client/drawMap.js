/* This file is part of Friendfind.

 drawMap():
  Draws map containing marks of own and every friend's coordinates.
  Loads coordinates from localStorage.
  Suppose there are element 'mapContainer'

 drawRoute():
  Draws route between own and target's coordinates.
*/
/*globals writeLog, google*/
var myMarker, map;

function moveMyMarkerOnMap(lat, lon) {
    var coordinates = new google.maps.LatLng(lat, lon);
    myMarker.setPosition(coordinates);
    map.panTo(coordinates);
}

function drawMap() {
    writeLog("LOG: drawMap called");


    //Value in localStore is two-value-list (not google.maps.LatLng-object)
    var ownLat = localStorage.ownLatitude;
    var ownLon = localStorage.ownLongitude;
    var coords = new google.maps.LatLng(ownLat, ownLon);

    //var user_table = JSON.parse(localStorage.friends);
    //since we dont use user table anymore lets just add the örkki and now choise 2 is for debug
    //var user_table = $('#targetLat').val()+","+$('#targetLong').val(); //(1)
    var user_table = [];
    
    user_table["orkki"] = (parseFloat(localStorage.ownLatitude)+0.0005)+","+localStorage.ownLongitude; //(2)
    user_table[localStorage.sessionId] =  localStorage.ownLatitude +","+localStorage.ownLongitude;
    
    //writeLog("drawMap: friendsJSON="+localStorage.friends);

    var mapOptions = {
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

    for (x in user_table) {
        var latitude = user_table[x].substring(0, user_table[x].indexOf(","));
        var longitude = user_table[x].substring(user_table[x].indexOf(",") + 1, user_table[x].length);

        var friendCoords = new google.maps.LatLng(latitude, longitude);
        var desc = "";
        var thisIsFriend = true;

        if (x == localStorage.sessionId) {
            //writeLog("This is me!")
            desc = "Your current location!";
            thisIsFriend = false;
            myMarker = new google.maps.Marker({
                position: friendCoords,
                map: map,
                icon: "/images/ownLocation.gif",
                title: desc,
                optimized: false
            });
        } else {
            desc = "user:" + x;
            var marker = new google.maps.Marker({
                position: friendCoords,
                map: map,
                title: desc
            });
        }



        //add context menu to the friends (not for user)
        if (thisIsFriend) {


            var contentString = '<div id="markerInfo">' +
                '<p><b>' + desc + '</b></p>' +
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

            google.maps.event.addListener(marker, 'click', function (mouseEvent) {
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
        } //end of if thisIsFriend
    };

    //writeLog("friend: '"+desc+"':"+latitude+" and "+longitude);
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