let flightIndex=getDataLocalStorage(FLIGHT_INDEX_KEY);
//create end date and time
let d = new Date(flights._scheduleList[flightIndex]._completeTime);
let display=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
let display2=`${d.getHours()}:${d.getMinutes()}`;
let minutes=Math.floor((flights._scheduleList[flightIndex]._duration/(60*60)-Math.floor(flights._scheduleList[flightIndex]._duration/(60*60)))*60);

let e=new Date(flights._scheduleList[flightIndex]._duration);
let display3=`${e.getHours()}:${e.getMinutes()}`;

let output = "";
output += `<tr>`;
output += `<td>${flights._scheduleList[flightIndex]._date}</td>`;
output += `<td>${flights._scheduleList[flightIndex]._time}</td>`;
output += `<td>${flights._scheduleList[flightIndex]._origin}</td>`;
output += `<td>${flights._scheduleList[flightIndex]._destination}</td>`;
output += `<td>${flights._scheduleList[flightIndex]._plane._registration}</td>`;
output += `<td>${Math.floor(flights._scheduleList[flightIndex]._duration/(60*60))}hr ${minutes}min</td>`;
output += `<td>${flights._scheduleList[flightIndex]._weather[0].currently.summary}</td>`;
output += `<td>${flights._scheduleList[flightIndex]._weather[1].currently.summary}</td>`;
output += `<td>${flights._scheduleList[flightIndex]._distance}km</td>`;
output += `<td>${display}</td>`;
output += `<td>${display2}</td>`;
output += `</tr>`;
document.getElementById("flightDetails").innerHTML= output;

function deleteRoute()
{
  fleetDelete(flights._scheduleList[flightIndex]._plane._registration);
  flights._scheduleList.splice(flightIndex,1);
  updateLocalStorage(SCHEDULE_DATA_KEY,flights);
  window.location="myflights.html";
};
function prevPage()
{
  window.location="myflights.html"
};
