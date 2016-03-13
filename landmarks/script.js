//Javascript for landmakrs


var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
			zoom: 13,
			center: me,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

function init()
{
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}
function renderMap() {
	me = new google.maps.LatLng(myLat, myLng);
	
	// Update map and go there...
	map.panTo(me);
	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "<p>It's Me!</p><p class = 'login'>PAM_FRANCO</p>",		
		icon: "Smiley1.png"
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

	//after rendering my own position, handle the datastore
	getClassData();
}

var classData = {};
function getClassData() {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', "https://defense-in-derpth.herokuapp.com/sendLocation", true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
    	classData = JSON.parse(this.responseText);
    	displayPeople();
    	displayLandmarks();
	};
	sendstring = "login=PAM_FRANCO&lat="+myLat+"&lng="+myLng
	xhr.send(sendstring);
}
function displayPeople() {
	for (i = 0; i < classData.people.length; i++) {
		if (classData.people[i].login == "PAM_FRANCO") {
			continue; //skip myself
		}
		pplPos = new google.maps.LatLng(classData.people[i].lat, classData.people[i].lng);
		pplMarker = new google.maps.Marker({
			position: pplPos,
		
			title: "<p class = 'login'>"+classData.people[i].login+"</p><p class = 'distance'>distance from me: "
			       +distanceFromMe(classData.people[i].lat, classData.people[i].lng)+" miles</p>",		
			icon: "computer-marker.png"
		});
		pplMarker.setMap(map);
		
		// Open info window on click of marker
		google.maps.event.addListener(pplMarker, 'click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map, this);
		});
	}
}
function distanceFromMe(lat, lng) {
	Number.prototype.toRad = function() {
   		return this * Math.PI / 180;
	}

	var lat2 = lat; 
	var lon2 = lng; 
	var lat1 = myLat; 
	var lon1 = myLng; 

	var R = 6371; // km 
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	d /= 1.60934 //convert to miles
	return d;
}
function displayLandmarks() {
	for (i = 0; i < classData.landmarks.length; i++) {
		var dis = distanceFromMe(classData.landmarks[i].geometry.coordinates[1], classData.landmarks[i].geometry.coordinates[0]);
		if (dis > 1) { //if more than one mile away
			continue;
		}
		landmarkPos = new google.maps.LatLng(classData.landmarks[i].geometry.coordinates[1], classData.landmarks[i].geometry.coordinates[0]);
		landMarker = new google.maps.Marker({
			position: landmarkPos,
			title: "<p class = 'landmark'>"+classData.landmarks[i].properties.Details+"</p><p class = 'distance'>distance from me: "
			       +dis+" miles</p>",		
			icon: "landmark.png"
		});
		landMarker.setMap(map);
		// Open info window on click of marker
		google.maps.event.addListener(landMarker, 'click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map, this);
		});
	}
}