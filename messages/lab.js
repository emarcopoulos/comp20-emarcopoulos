// Your JavaScript goes here...
function parse() {
	request = new XMLHttpRequest();
	request.open("GET", "data.json", true);
	request.send(null);
	request.onreadystatechange = function () {
		if (request.status == 200 && request.readyState == 4) {
			data = JSON.parse(request.responseText);
			for (i = 0; i < data.length; i++) {
				messages = document.getElementById("messages");
				messages.innerHTML  = messages.innerHTML + "<p><span class = 'message'>" 
									+ data[i].content + "</span><span class = 'name'>	" 
									+ data[i].username + "</span></p>";
			}
		}
	}
}