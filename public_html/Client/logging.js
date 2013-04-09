function writeLog(message) {
	console.log(message);
	$.post("/Log", {
		'msg': message
	});
}