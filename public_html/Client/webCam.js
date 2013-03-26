/* This file is part of Friendfind.

 webCam starts webcam and shows video stream to the element 'webCamCanvas'
  Fallback=show static image (needs 'webCamCanvasFallback'

 *Suppose there are element called 'webCamCanvas'
 *Suppose there are element called 'webCamCanvasFallback'

*/
/*globals writeLog*/

var videoStream = null;
var video = null;

function noStream()
{
	writeLog('noStream =(');
}

function gotStream(stream)
{
	videoStream = stream;
	writeLog('Start stream');
	video.onerror = function ()
	{
		writeLog('video.onerror');
		if (video) stop();
	};
	stream.onended = noStream;
	if (window.webkitURL) video.src = window.webkitURL.createObjectURL(stream);
	else if (video.mozSrcObject !== undefined)
	{//FF18a
		video.mozSrcObject = stream;
		video.play();
	}
	else if (navigator.mozGetUserMedia)
	{//FF16a, 17a
		video.src = stream;
		video.play();
	}
	else if (window.URL) video.src = window.URL.createObjectURL(stream);
	else video.src = stream;
}


function webCam()
{
writeLog("webCam called");
video = document.getElementById('webCamCanvas');

	if ((typeof window === 'undefined') || (typeof navigator === 'undefined'))
		writeLog('typeof window is undefined!');
	else if (!(video))
		writeLog('No element for video!');
	else
	{
		writeLog('Starting webcam');
		if (navigator.getUserMedia) navigator.getUserMedia({video:true}, gotStream, noStream);
		else if (navigator.oGetUserMedia) navigator.oGetUserMedia({video:true}, gotStream, noStream);
		else if (navigator.mozGetUserMedia) navigator.mozGetUserMedia({video:true}, gotStream, noStream);
		else if (navigator.webkitGetUserMedia) navigator.webkitGetUserMedia({video:true}, gotStream, noStream);
		else if (navigator.msGetUserMedia) navigator.msGetUserMedia({video:true, audio:false}, gotStream, noStream);
else { //Fallback, if there are no webcam, show static image
	writeLog('No support for webcam.');
	var layer_image = document.getElementById('webCamCanvasFallback');
	var context_image = layer_image.getContext('2d');

	var imageObj = new Image();
	imageObj.onload = function(){
		var destX = layer_image.width / 2 - this.width / 2;
		var destY = layer_image.height / 2 - this.height / 2;
		context_image.drawImage(this, destX, destY);
	};
	//image from wikipedia (Ilmari Karonen: CC3-SA-BY)
	//http://en.wikipedia.org/wiki/File:Kumpula_Campus_Physicum.jpg
        imageObj.src = "webcam_fallback.jpg";
}

	
	}

//update augmented reality
//route3dUpdateCameraPosition();
}
function webCam_test(){
route3dUpdateCameraPosition();

}
