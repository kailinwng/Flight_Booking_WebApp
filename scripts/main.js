// Script that will be used for Main Page
let marker;
var object;
let routeId = "";
let scheduleRouteArray = [];
let ongoingRouteArray = [];
let pastRouteArray = [];
// Function to filter arrays based on the checkboxes
function filterRoutes()
{
  //Firstly, Delete any layer on map
  removeRouteDisplay(ongoingRouteArray)
  removeRouteDisplay(scheduleRouteArray);
  removeRouteDisplay(pastRouteArray);
  // Delete all redMarkers
  removeMarkers(orangeMarkers);
  // Get Checkbox IDs
  let showOngoing = document.getElementById("checkbox-1").checked;
  let showScheduled = document.getElementById("checkbox-2").checked;
  let showPast = document.getElementById("checkbox-3").checked;

  // Creating layers
  if (showOngoing == true)
  {
    if (checkIfDataExistsLocalStorage(ONGOING_DATA_KEY) == true) {
      let ongoingData = getDataLocalStorage(ONGOING_DATA_KEY);
      let ongoingFlight = new ScheduleList;
      ongoingFlight.fromData(ongoingData);

      for (let i = 0; i < ongoingFlight._scheduleList.length; i++) {
        object = {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: []
        }}};
        for(let j = 0; j < ongoingFlight._scheduleList[i]._route.length; j++) {
          object.data.geometry.coordinates.push([ongoingFlight._scheduleList[i]._route[j].lng, ongoingFlight._scheduleList[i]._route[j].lat]);
        }
        // Creating Route
        routeId = "ongoing" + i;
        map.addLayer({
        id: routeId,
        type: "line",
        source: object,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#1e90ff", "line-width": 6 }
        });
        map.on('click',routeId,function() { window.location = "myflights.html"; })
        ongoingRouteArray.push(routeId);
        // Creating Markers
        for(let j = 0; j < ongoingFlight._scheduleList[i]._route.length; j++) {
          marker = new mapboxgl.Marker({ "color": "#FF0066" });
          marker.setLngLat([ongoingFlight._scheduleList[i]._route[j].lng, ongoingFlight._scheduleList[i]._route[j].lat]);
          let popup = new mapboxgl.Popup({ offset: 45});
          popup.setHTML(ongoingFlight._scheduleList[i]._route[j].description);
          marker.setPopup(popup);
          marker.addTo(map);
          blueMarkers.push(marker);
        }
      }
    }
  }
  if (showScheduled == true)
  {
    if (checkIfDataExistsLocalStorage(SCHEDULE_DATA_KEY) == true) {
      let scheduleData = getDataLocalStorage(SCHEDULE_DATA_KEY);
      let scheduledFlight = new ScheduleList;
      scheduledFlight.fromData(scheduleData);

      for (let i = 0; i < scheduledFlight._scheduleList.length; i++) {
        object = {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: []
        }}};
        for(let j = 0; j < scheduledFlight._scheduleList[i]._route.length; j++) {
          object.data.geometry.coordinates.push([scheduledFlight._scheduleList[i]._route[j].lng, scheduledFlight._scheduleList[i]._route[j].lat]);
        }
        // Creating Route
        routeId = "ongoing" + i;
        map.addLayer({
        id: routeId,
        type: "line",
        source: object,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#1e90ff", "line-width": 6 }
        });
        map.on('click',routeId,function() { window.location = "myflights.html"; })
        scheduleRouteArray.push(routeId);
        // Creating Markers
        for(let j = 0; j < scheduledFlight._scheduleList[i]._route.length; j++) {
          marker = new mapboxgl.Marker({ "color": "#FF4500" });
          marker.setLngLat([scheduledFlight._scheduleList[i]._route[j].lng, scheduledFlight._scheduleList[i]._route[j].lat]);
          let popup = new mapboxgl.Popup({ offset: 45});
          popup.setHTML(scheduledFlight._scheduleList[i]._route[j].description);
          marker.setPopup(popup);
          marker.addTo(map);
          orangeMarkers.push(marker);
        }
      }
    }
  }
  if (showPast == true)
  {
    if (checkIfDataExistsLocalStorage(COMPLETED_DATA_KEY) == true) {
      let completedData = getDataLocalStorage(COMPLETED_DATA_KEY);
      let completedFlight = new ScheduleList;
      completedFlight.fromData(completedData);

      for (let i = 0; i < completedFlight._scheduleList.length; i++) {
        object = {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: []
        }}};
        for(let j = 0; j < completedFlight._scheduleList[i]._route.length; j++) {
          object.data.geometry.coordinates.push([completedFlight._scheduleList[i]._route[j].lng, completedFlight._scheduleList[i]._route[j].lat]);
        }
        // Creating Route
        routeId = "ongoing" + i;
        map.addLayer({
        id: routeId,
        type: "line",
        source: object,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#1e90ff", "line-width": 6 }
        });
        pastRouteArray.push(routeId);
        // Creating Markers
        for(let j = 0; j < completedFlight._scheduleList[i]._route.length; j++) {
          marker = new mapboxgl.Marker({ "color": "#FF0000  " });
          marker.setLngLat([completedFlight._scheduleList[i]._route[j].lng, completedFlight._scheduleList[i]._route[j].lat]);
          let popup = new mapboxgl.Popup({ offset: 45});
          popup.setHTML(completedFlight._scheduleList[i]._route[j].description);
          marker.setPopup(popup);
          marker.addTo(map);
          redMarkers.push(marker);
        }
      }
    }
  }
}

// Search Function
function search()
{
  removeMarkers(redMarkers);
  let searchInput = document.getElementById("fixed-header-drawer-exp").value;
  airportCountry(searchInput);
}

function removeRouteDisplay(routeArray) {
  var id;
  var hasPoly;
  if (routeArray !== null) {
    for (let i = routeArray.length - 1; i >= 0; i--) {
      id = routeArray[i]
      hasPoly = map.getLayer(id);
    	if (hasPoly !== undefined)	{
    		map.removeLayer(id);
    		map.removeSource(id);
    	}
    }
  }
}
// Codes that will run on page load :
// getNearbyAirport(144.9648731,-37.8182711, 500);
