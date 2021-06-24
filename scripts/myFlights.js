function nextPage()
{
  window.location="schedule.html";
}
function detailsPage(i)
{a=9;
  updateLocalStorage(FLIGHT_INDEX_KEY,i)
  window.location="flightdetails.html";
}

//functions for Myflights cuz they only work here not in other
//initializing
let flights=new ScheduleList();
let newData=getDataLocalStorage(SCHEDULE_DATA_KEY);
flights.fromData(newData);

function displayFlights(){
  let flightsRef=document.getElementById("flights");
  let output="";
  for(let i=0;i<flights._scheduleList.length;i++)
  {
    output+=`   <tr>
    <td>${flights._scheduleList[i]._date}</td>
    <td>${flights._scheduleList[i]._time}</td>
    <td>${flights._scheduleList[i]._origin}</td>
    <td>${flights._scheduleList[i]._destination}</td>
    <td><button class="mdl-button mdl-js-button mdl-js-ripple-effect" onclick="detailsPage(${i})">>
    </button></td>
    </tr>`
  }
  flightsRef.innerHTML=output;
}
// run on load
displayFlights();

function nextPage()
{
  window.location="schedule.html";
}

function sortByDate(){
  for (let i = 0; i < flights._scheduleList.length - 1; i++)
  {
    let minIndex = i;
    for (let j = i + 1; j < flights._scheduleList.length; j++)
    {
      if (flights._scheduleList[j]._date < flights._scheduleList[minIndex]._date)
      {
        minIndex = j;
      }
    }
    if (minIndex !== i)
    {
      let temp = flights._scheduleList[i];
      flights._scheduleList[i] = flights._scheduleList[minIndex];
      flights._scheduleList[minIndex] = temp;
    }
  }
  updateLocalStorage(SCHEDULE_DATA_KEY,flights);
  displayFlights();
}

function sortByCountry(){
  for (let i = 0; i < flights._scheduleList.length - 1; i++)
  {
    let minIndex = i;
    for (let j = i + 1; j < flights._scheduleList.length; j++)
    {
      if (flights._scheduleList[j]._destination < flights._scheduleList[minIndex]._destination)
      {
        minIndex = j;
      }
    }
    if (minIndex !== i)
    {
      let temp = flights._scheduleList[i];
      flights._scheduleList[i] = flights._scheduleList[minIndex];
      flights._scheduleList[minIndex] = temp;
    }
  }
  updateLocalStorage(SCHEDULE_DATA_KEY,flights);
  displayFlights();
}
