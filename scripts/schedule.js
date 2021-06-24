// Srcipts for Schedule Page
function saveFlight()
{
  let layoverOutput = "";
  dateRef = document.getElementById("dateInput");
  timeRef = document.getElementById('timeInput');
  originRef = document.getElementById("originInput");
  destinationRef = document.getElementById("destinationCountry");
  routeData = document.getElementById("layoverList").value;
  for (let i = 1; i <routeData.length; i++) {     // i is set to 1 since routeData[0] is Origin
    if ( i < routeData.length-1) {
      layoverOutput += routeData[i].description + ", ";
    }
    else {
      layoverOutput += routeData[i].description;
    }
  }
  // Check if any input is empty
  if (!dateRef.value || !timeRef.value || !routeData[0].country || !routeData[routeData.length-1].country) {
    alert("Please Input Required Fields");
  }
  else {
    fleetBooked(tempPlaneReg);  //tempPlaneReg is global temporary plane registration at scheduledMap.js
    //get plane object
    let plane = findPlane(tempPlaneReg);
    //get distance
    let distanceValue = 0;
    for (let i = 0; i<routeData.length-1; i++){
      let coordinate1 = [routeData[i].lng,routeData[i].lat];
      let coordinate2 = [routeData[i+1].lng,routeData[i+1].lat];
      distanceValue += distance(coordinate1,coordinate2);
    }
    distanceValue = distanceValue.toFixed(2);
    //get duration
    let durationValue = duration(distanceValue,plane.avgSpeed);   //s
    //get time
    const SECONDS_TO_MS = 1000;
    let flightDuration = durationValue*SECONDS_TO_MS;
    let startTime = new Date(`${dateRef.value}, ${timeRef.value}`);
    startTime = startTime.getTime();  //ms
    let completeTime = startTime + flightDuration; //ms
    let displayTime = new Date(completeTime);
    //get weather
    let test = getCurrentWeather(routeData[0].lng,routeData[0].lat);

    let originWeather = getCurrentWeather(routeData[0].lng,routeData[0].lat);
    let destinationWeather = getCurrentWeather(routeData[routeData.length-1].lng,routeData[routeData.length-1].lat);
    let weather=[originWeather,destinationWeather];

    let output = "";
    output += "<h4>Confirmed Flight Details: </h4>";
    output += "<br>Date of flight: " + dateRef.value;
    output += "<br>Time of flight: " + timeRef.value;
    output += "<br>Point of origin: " + routeData[0].country;
    output += "<br>Waypoints: " + layoverOutput;
    output += "<br>Destination: " + routeData[routeData.length-1].country;
    output += "<br>Total distance: " + distanceValue;
    output += "<br>Time of Arrival: " + `${displayTime.getHours()}:${displayTime.getMinutes()}, ${displayTime.getFullYear()}-${displayTime.getMonth()+1}-${displayTime.getDay()}`;
    output += "<br>Weather: ";
    output += "SAVE</button>";
    output += "<br><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" onclick=\"confirmSave\">";
    output += `<br>Destination: ${weather[1].currently.temperature}C, ${weather[1].currently.summary}, UV Index: ${weather[1].currently.uvIndex}`;
    output += `<br>Origin: ${weather[0].currently.temperature}C, ${weather[0].currently.summary}, UV Index: ${weather[0].currently.uvIndex}`;
    output += "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored\" onclick=\"goBacktoMainPage()\">";
    output += "SAVE</button>";

    popup(output);

    if (confirm("Do you want to save this flight?") )
    {
      let sched= new Schedule(dateRef.value,timeRef.value,routeData,weather,distanceValue,plane,durationValue,startTime,completeTime,routeData[0].country,routeData[routeData.length-1].country);
      scheduleList.addSchedule(sched);
      updateLocalStorage(SCHEDULE_DATA_KEY, scheduleList);
      window.location = "index.html";
    }
    else
    {
      alert("Flight is not saved.");
    }
  }
}

function popup(text)
{
  // Get the modal
  let modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";
  outputRef= document.getElementById("outputMessage");
  outputRef.innerHTML= text;

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function goBacktoMainPage() {
  window.location = "index.html";
}

let scheduleList = new ScheduleList();
let data = getDataLocalStorage(SCHEDULE_DATA_KEY);
if (data !== null)
{
  scheduleList.fromData(data);
}
