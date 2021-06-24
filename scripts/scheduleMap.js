let tempPlaneReg = "";    //temporary holder for plane registration name

// Creating Map
mapboxgl.accessToken = "pk.eyJ1IjoidGVhbWFjYzY5NDIwIiwiYSI6ImNrYTE1YmdzejB2ZmkzaG52N2swY2RycGcifQ.Z-FH8UOPeQH155J-xFiKsg";
let scheduleMap = new  mapboxgl.Map({
container: 'scheduleMap',
center: [144.9648731,-37.8182711],
zoom: 1.5,
style: 'mapbox://styles/mapbox/streets-v9'
});
// Global Variables
let coordList = [];
var originCoordinate;
let layoverCoord = [];
let layoverArray = [];
var layoverButton;
var layoverRange;
var destinationCoord;
// Search for Country -> Pan to Country -> Display Available Airport -> Create List of available plane
function searchOrigin() {
  let searchInput = document.getElementById("originInput").value; // Get User input value
  findCountry(searchInput);                                       // Find the country user searched
  coordList = [];                                                 // Reset CoordList because this is a new schedule
}

function findCountry(country) {
 let airportUrl = "https://eng1003.monash/api/v1/airports/";      // get airport URl for API
 let airportData = {                                              // Create airportData to use API function that search airports in a country
   country: country,                                              // Parameter Country for input
   callback: "displayAvailableAirport"                            // Transfer data to "displayAvailableAirport"
 };
 webServiceRequest(airportUrl, airportData);                      // Request web service
}

function displayAvailableAirport(data) {
  if (data.length == 0) {
    alert("sorry, country not found");
  }
  else {
    let planeData = getDataLocalStorage(LOCAL_PLANE_DATA_KEY);      // Get planeData from storage
    let planeAvailable = false;                                     // intialize planeAvailable as false to assume no airport is found in an airport
    let planeFound = false;                                         // initialize planeFound as false
    let locations = [];                                             // Initialized locations array
    var marker2;                                                    // Initialized marker2.
    var output;                                                     // Initialized output
    for (let i = 0; i < data.length; i++) {
      locations[i] = {
        coordinates: [data[i].longitude, data[i].latitude],         // Transfer relevant data to locations array by looping
        description: data[i].name+"<br>",
        code:data[i].airportCode,
        country: data[i].country
      };
    }
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < planeData._planes.length; j++)  {
        if (locations[i].code == planeData._planes[j]._location && planeData._planes[j]._status == "available") {
          planeFound = true;                                        // setting planeFound = true for later use
          marker2 = new mapboxgl.Marker({ "color": "#1e90ff" });    // The idea is to Loop over all the airport in a country
          marker2.setLngLat(locations[i].coordinates);              // Then for each airport, loop over planeData
          let popup = new mapboxgl.Popup({ offset: 45});            // to see if any plane is parked there AND is available
          output = createListHTML(locations[i]);                    // if plane exist, display markers and corresponding info pop up
          popup.setHTML(locations[i].description + output);         // createListHTML is a function that create list
          marker2.setPopup(popup);                                  // of available plane and display it in popup
          marker2.addTo(scheduleMap);
          blueMarkers.push(marker2);                                // insert every marker created here to array to group them
        }
      }
    }
    panToCountry(data[0].longitude, data[0].latitude);              // Once all markers are displayed, pan to them
    if (planeFound == false) {
      initialCoordinate = [data[0].longitude, data[0].latitude];    // If no plane is found in a country, run the function noPlaneFound
      if (confirm("No Plane is available in this area, search for 5 nearest flight?")) {
        noPlaneFound(initialCoordinate);                            // Pass in the initial coordinate to get 5 nearest airport to it later
      }
    }
  }
}

function panToCountry(Lng, Lat) {
  let country = [Lng, Lat];                                       // Not much to say here
  scheduleMap.panTo(country);                                     // using in-built function provided by mapbox to pan to coordinate
}

function createListHTML(location) {
  let planeData = getDataLocalStorage(LOCAL_PLANE_DATA_KEY);
  let listHTML = "<ul class=\"demo-list-control mdl-list\">";                   // This purpose of this function is to create unique list of available plane
  for (let i = 0; i < planeData._planes.length; i++) {                          // Using MDL list class
    if (planeData._planes[i]._location == location.code) {                      // Each marker will have different plane list
      listHTML += "<li class=\"mdl-list__item\">";                              // Each button will run the same onclick function
      listHTML += "<span class=\"mdl-list__item-primary-content\">";            // But will pass in unique parameter values of its own
      listHTML += "<i class=\"material-icons\">flight</i>";
      listHTML += planeData._planes[i]._registration;
      listHTML += "</span><span class=\"mdl-list__item-secondary-action\">";
      listHTML += "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" ";
      listHTML += 'onclick="selectPlane(\'' +location.coordinates[0]+ '\',\'' +location.coordinates[1]+ '\',\'' +planeData._planes[i]._registration+ '\',\'' +planeData._planes[i]._location+ '\',\'' +planeData._planes[i]._range+ '\',\'' +planeData._planes[i]._airline+ '\',\'' +location.country+ '\')">';
      listHTML += "Select</button>";
      listHTML += "</span></li>";
    }
  }
  listHTML += "</ul>";
  return listHTML;
}
// Selected a plane -> find reachable airport -> create buttons for selectable airport
function selectPlane(lng, lat, registration, location, range, airline, country) {
 let displayPlaneDiv = document.getElementById("selectedPlane");  // get id of div to display selected plane
 originCoordinate = {
   coordinates: [lng, lat],
   lng: lng,
   lat: lat,
   description: location,
   country: country
 };
 removeMarkers(redMarkers);                                       // remove any markers on map
 removeMarkers(blueMarkers);                                      // so that it only shows selectable destination airport
 createLayover(lng, lat, range);                                  // get reachablle airport

 tempPlaneReg = registration;                                     //store selected plane for update of fleetInfo

 let output = "<h5>Registration: " + registration+ "<br>";        // display selected plane on div
 output += "Airline: " +airline+ "<br>";
 output += "Location: " +location+ "<br>";
 output += "Range: " +range+ "<br></h5>";
 // Create cancel button
 let cancelButton = "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" id=\"cancelButton\"";
 cancelButton += 'onclick="cancel()">';
 cancelButton += "Cancel";                                        // create cancel button to cancel schedule anytime
 cancelButton += "</button>";                                     // display it
 displayPlaneDiv.innerHTML = output + cancelButton;
}

function cancel() {
  removeMarkers(purpleMarkers);                                   // remove any existing markers displayed
  removeMarkers(redMarkers);                                      // along with any routes
  removeMarkers(orangeMarkers);
  removeLayerWithId("routes");
  let div = document.getElementById("selectedPlane");             // Get the div to display selected plane
  let div2 = document.getElementById("destinationCountry");       // Get the div to display selected destination
  let div3 = document.getElementById("layover");                  // Get the div to display selected layover
  div.innerHTML  = "";                                            // Reset Div
  div2.innerHTML = "Destination: ";                               // Reset Div
  div3.innerHTML = "";                                            // Reset Div
  coordList = [];                                                 // Resets coordlist for later use
  searchOrigin();                                                 // Map should be reset, run beginning function again
}
// If no airport is found -> get all Coordinate of planes -> Sort them -> display first 5
function noPlaneFound() {
  let planeData = getDataLocalStorage(LOCAL_PLANE_DATA_KEY);      // Get PlaneData
  for (let i = 0; i < planeData._planes.length; i++) {
    getAirportCoordinates(planeData._planes[i]._location);        // Get coordinates of every plane, through their location
  }
}

function getAirportCoordinates(code) {
  let airportUrl = "https://eng1003.monash/api/v1/airports/";     // Calling API function to get coordinates
  let airportData = {
    code: code,
    callback: "setCoordinateList"
  };
  webServiceRequest(airportUrl, airportData);
}

function setCoordinateList(data) {
  let lng = data.longitude;                                       // Get Longitude of the plane
  let lat = data.latitude;                                        // Get Latitude of the plane
  let airport = {
    coordinates: [lng, lat],                                      // Creating object to hold neccessary info of plane
    code: data.airportCode,
    country: data.country,
    description: data.name
  };
  coordList.push(airport);                                        // Push each object created to array of coordinates
  if (coordList.length == 29) {                                   // This is repeated until all we get the coordinates of every plane
    getNearestPlane();                                            // After that, run function to get nearest plane
  }
}

function getNearestPlane() {
  let planeData = getDataLocalStorage(LOCAL_PLANE_DATA_KEY);      // get planeData from local storage
  let locations = [];                                             // Preparing locations array for each plane
  var marker2;
  for (let i = 0; i < coordList.length; i++) {
    if (planeData._planes[i]._status == "available") {            // Creating neccessary info of each plane into object
      locations[i] = {
        coordinates: coordList[i].coordinates,
        registration: planeData._planes[i]._registration,
        distance: distance(initialCoordinate, coordList[i].coordinates), // calculate distance from each plane to initial Coordinate
        description: coordList[i].description + "<br>",
        code: coordList[i].code,
        country: coordList[i].country
      };
    }
  }
  locations.sort( function (a,b) { return a.distance - b.distance; });  // sort the array in ascending order
  for (let j = 0; j < 5; j++) {                                         // only display the first 5 planes
    marker2 = new mapboxgl.Marker({ "color": "#1e90ff" });              // which is the closest 5
    marker2.setLngLat(locations[j].coordinates);
    let popup = new mapboxgl.Popup({ offset: 45});
    output = createListHTML(locations[j]);
    popup.setHTML(locations[j].description + output);
    marker2.setPopup(popup);
    marker2.addTo(scheduleMap);
    blueMarkers.push(marker2);
  }
  panToCountry(locations[0].coordinates[0],locations[0].coordinates[1]);// Pan to country
}
// Display airport within coordinate -> select new Airport -> new coord = coord -> loop until user stays stop
function createLayover(lng, lat, range) {
  removeMarkers(blueMarkers);                                     // remove every markers in map
  removeMarkers(orangeMarkers);
  removeLayerWithId("routes");                                    // remove routes aswell
  let displayLayover = document.getElementById("layover");        // get div to display layovers
  let output = "";
  output += "<div id=\"layoverList\"></div>";
  output += "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" ";
  output += 'onclick="stopLayover()">';
  output += "END DESTINATION</button>";
  displayLayover.innerHTML = output;
  layoverArray = [];
  layoverCoord = [lng, lat];
  layoverRange = range;
  getNearbyLayover();
  //getNearbyLayover -> displayNearbyLayover
  // Onclick(new coordinate, airportcode, country) -> function(layoverArray.push -> LayoverCoord = newLayover coord -> call layogver function again
}

function getNearbyLayover() {
  let airportUrl = "https://eng1003.monash/api/v1/airports/";
  let airportData = {
    lat: layoverCoord[1],
    lng: layoverCoord[0],
    range: layoverRange,
    callback: "displayNearbyLayover"
  };
  webServiceRequest(airportUrl, airportData);
}

function displayNearbyLayover(data) {
  let locations = [];
  for (let i = 0; i < data.length; i++) {
    locations[i] = {
      lng: data[i].longitude,
      lat: data[i].latitude,
      coordinates: [data[i].longitude, data[i].latitude],
      description: data[i].name,
      country: data[i].country,
      code:data[i].airportCode
    };
  }
  for (let i = 0; i < locations.length; i++) {
    marker2 = new mapboxgl.Marker({ "color": "#8A2BE2" });
    marker2.setLngLat(locations[i].coordinates);
    let popup = new mapboxgl.Popup({ offset: 45});
    selectButton = createButtonLayoverHTML(locations[i]);
    popup.setHTML(locations[i].description + "<br>" + selectButton);
    marker2.setPopup(popup);
    marker2.addTo(scheduleMap);
    purpleMarkers.push(marker2);
  }
}

function createButtonLayoverHTML(location) {
  let button = "";
  button += "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" ";
  button += 'onclick="selectLayover(\'' +location.country+ '\',\'' +location.code+ '\',\'' +location.lng+ '\',\'' +location.lat+ '\')">';
  button += "SELECT DESTINATION";
  button += "</button>";
  return button;
}

function selectLayover(country, airportCode, lng, lat) {
  layoverObj = {
    country: country,
    description: airportCode,
    lng: lng,
    lat: lat
  };
  layoverArray.push(layoverObj);
  createLayoverList();
  removeMarkers(purpleMarkers);
  layoverCoord = [lng, lat];
  getNearbyLayover();
}

function createLayoverList() {
  let listRef = document.getElementById("layoverList");
  let list = "<ul class=\"demo-list-two mdl-list\">";
  for (let i = 0; i < layoverArray.length; i++) {
    list += "<li class=\"mdl-list__item mdl-list__item--two-line\">";
    list += "<span class=\"mdl-list__item-primary-content\">";
    list += "<i class=\"material-icons mdl-list__item-avatar\">local_airport</i>";
    list += "<span>" +layoverArray[i].description+ "</span>";
    list += "<span class=\"mdl-list__item-sub-title\">" +layoverArray[i].country+ "</span></span></li>";
  }
  list += "</ul>";
  listRef.innerHTML = list;
}

function stopLayover() {
  removeMarkers(purpleMarkers);
  let locations = [];
  locations.push(originCoordinate);
  for (let i = 0; i < layoverArray.length; i++) {
    locations.push({
      coordinates: [layoverArray[i].lng, layoverArray[i].lat],
      description: layoverArray[i].description,
      lng: layoverArray[i].lng,
      lat: layoverArray[i].lat,
      country: layoverArray[i].country
    });
  }
  displayRoutes(locations);
  let layoverRef = document.getElementById("layoverList");
  layoverRef.value = locations;
}

function displayRoutes(locations) {
  let object = {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: []
  }}};
  for(let i = 0; i < locations.length; i++) {
    object.data.geometry.coordinates.push(locations[i].coordinates);
  }
  scheduleMap.addLayer({
  id: "routes",
  type: "line",
  source: object,
  layout: { "line-join": "round", "line-cap": "round" },
  paint: { "line-color": "#1e90ff", "line-width": 6 }
  });

  for (let i = 0; i < locations.length; i++) {
    marker2 = new mapboxgl.Marker({ "color": "#FF4500" });
    marker2.setLngLat(locations[i].coordinates);
    let popup = new mapboxgl.Popup({ offset: 45});
    popup.setHTML(locations[i].description);
    marker2.setPopup(popup);
    marker2.addTo(scheduleMap);
    orangeMarkers.push(marker2);
  }
}

function removeLayerWithId(idToRemove)  {
	let hasPoly = scheduleMap.getLayer(idToRemove);
	if (hasPoly !== undefined)	{
		scheduleMap.removeLayer(idToRemove);
		scheduleMap.removeSource(idToRemove);
	}
}
