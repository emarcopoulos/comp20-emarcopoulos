// Your JavaScript goes here...
function parse() {
	console.log("HELLO");
	request = new XMLHttpRequest();
	console.log("REQUEST");
	request.open("GET", "data.json", true);
	console.log("OPEN");
	request.send(null);
	console.log("SEND");
	request.onreadystatechange = function () {
		if (request.status == 200 && request.readyState == 4) {
			data = JSON.parse(request.responseText);
			console.log(data);	
			for (i = 0; i < data.length; i++) {
				messages = document.getElementById("messages");
				messages.innerHTML  = messages.innerHTML + "<p><span class = 'message'>" 
									+ data[i].content + "</span><span class = 'name'>	" 
									+ data[i].username + "</span></p>";
			}
		}
	}
}