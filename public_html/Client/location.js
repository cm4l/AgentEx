
//distance in kilometres
var ALERT_DISTANCE = 0.05;

function checkDistance(playerLat, playerLon, targetLat, targetLon) {
	if ( calcDistance(playerLat, playerLon, targetLat, targetLon) < ALERT_DISTANCE ) {
		//if only we had vibration support
	}
}

function calcDistance(lat1,lon1,lat2,lon2){
    var deg2rad = Math.PI / 180;
    
    var R = 6371; // km
    //var dLat = (lat2-lat1).toRad();
    var dLat = (lat2-lat1) * deg2rad;
    //var dLon = (lon2-lon1).toRad();
    var dLon = (lon2-lon1)* deg2rad;
    //var lat1 = lat1.toRad();
    var lat1 = lat1* deg2rad;
    //var lat2 = lat2.toRad();
    var lat2 = lat2* deg2rad;
    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
   
    return d;
    
}

