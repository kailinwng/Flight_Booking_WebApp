//********************* LOCAL STORAGE KEYS *********************//
const PLANE_DATA_KEY = "planeData"; //store API
const LOCAL_PLANE_DATA_KEY = "planes";  //store local plane data
const SCHEDULE_DATA_KEY = "scheduleKey";
const ONGOING_DATA_KEY = "ongoingKey";
const COMPLETED_DATA_KEY = "completedDataKey";
const FLIGHT_INDEX_KEY="flightIndexKey";

//********************* CLASSES *********************//
class Schedule{
	constructor(newDate="",newTime="",newRoute = [],newWeather=[],newDistance=0, newPlane= "", newDuration, newStartTime, newCompleteTime,newOrigin,newDestination)
	{
		this._date = newDate;
		this._time = newTime;
		this._route = newRoute;						//index 0 = Origin, index last = Desination
		this._weather = newWeather;				//index 0 = Origin, index 1 = Destination
		this._distance = newDistance;
		this._plane = newPlane;						//Object of plane info
		this._duration = newDuration;
		this._startTime = newStartTime;							//milliseconds from 1 January, 1970, 00:00:00 UTC to start of flight
		this._completeTime = newCompleteTime;				//milliseconds from 1 January, 1970, 00:00:00 UTC to completion of flight
		this._origin=newOrigin;
		this._destination=newDestination;
}

	get date(){
		return this._date;
	}
	get time(){
		return this._time;
	}
	get origin(){
		return this._origin;
	}
	get destination(){
		return this._destination;
	}
	get route(){
		return this._route;		//returns an array
	}
	get weather(){
		return this._weather;
	}
	get distance(){
		return this._distance;
	}
	get plane(){
		return this._plane;
	}
	get duration(){
		return this._duration;
	}
	get startTime(){
		return this._startTime;
	}
	get completeTime(){
		return this._completeTime;
	}

	set date(date){
		this._date = date;
	}
	set time(time){
		this._time=time;
	}
	set distance(distance){
		this._distance = distance;
	}
	set plane(plane){
		this._plane = plane;
	}
	set duration(duration){
		this._duration = duration;
	}
	set startTime(startTime){
		this._startTime = startTime;
	}
	set completeTime(completeTime){
		this._completeTime = completeTime;
	}
	set origin(origin){
		this._origin = origin;
	}
	set destination(destination){
		this._destination=destination;
	}


	fromData(object)
	{
		this._date = object._date;
		this._time = object._time;
		this._route = object._route;
		this._weather = object._weather;
		this._distance = object._distance;
		this._plane = object._plane;
		this._duration = object._duration;
		this._startTime = object._startTime;
		this._completeTime = object._completeTime;
		this._origin = object._origin;
		this._destination = object._destination;
	}

	toString()
	{
		output="";
		output+="Date of Flight: " + this._date;
		output+="\nTime of Flight: " + this._time;
		for(let i = 0; i < this._route.length; i++){
			if(i = 0){
				output+="\nOrigin Point: " + this._route[i] + "\nLayovers: ";
			}
			else if (i = this._route.length-1){
				output+="Destination: " + this._route[i];
			}
			else{
				output+= `${this._route[i]} \n`;
			}
		}
		return output;
	}
}
class ScheduleList{
	constructor()
	{
		this._scheduleList=[];
	}

	addSchedule(newSchedule)
	{
			this._scheduleList.push(newSchedule);
	}

	fromData(dataObject)
	{
		let data = dataObject._scheduleList;
		this._scheduleList = [];
		for(let i = 0; i < data.length; i++){
			let list = new Schedule();
			list.fromData(data[i]);
			this._scheduleList.push(list);
		}
	}
}

/////// Fleet ///////
class Plane{
  constructor(id,registration,location,range,avgSpeed,type,status,airline){
    this._id = id;  //internal
    this._registration = registration;
    this._location = location;
    this._range = range;
    this._avgSpeed = avgSpeed;
    this._type = type;
    this._status = status;
    this._airline = airline;
    this._tempLoc = "";
  }

	get id(){
		return this._id;
	}
  get registration(){
    return this._registration;
  }
  get location(){
    return this._location;
  }
  get range(){
    return this._range;
  }
  get avgSpeed(){
    return this._avgSpeed;
  }
  get type(){
    return this._type;
  }
  get status(){
    return this._status;
  }
  get airline(){
    return this._airline;
  }
  get tempLoc(){
    return this._tempLoc;
  }

  set location(newLoc){
    this._location = newLoc;
  }
  set status(newStatus){
    this._status = newStatus;
  }
  set tempLoc(newLoc){
    this._tempLoc = newLoc;
  }

  fromData(data){
    this._id = data._id;
    this._registration = data._registration;
    this._location = data._location;
    this._range = data._range;
    this._avgSpeed = data._avgSpeed;
    this._type = data._type;
    this._status = data._status;
    this._airline = data._airline;
  }
}
class PlaneList{
  constructor(){
    this._planes = [];
  }

  get planes(){
    return this._planes;
  }

  set planes(newPlanes){
    this._planes = newPlanes;
  }

  addPlane(inputParam){
    let id = inputParam[0];
    let reg = inputParam[1];
    let loc = inputParam[2];
    let range = inputParam[3];
    let avgSpeed = inputParam[4];
    let type = inputParam[5];
    let status = inputParam[6];
    let airline = inputParam[7];
    let newPlane = new Plane(id,reg,loc,range,avgSpeed,type,status,airline);
    this._planes.push(newPlane);
  }

  sortAirline(){
      for (let i = 0; i < this._planes.length - 1; i++)
      {
        let minIndex = i;
        for (let j = i + 1; j < this._planes.length; j++)
        {
          if (this._planes[j].airline < this._planes[minIndex].airline)
          {
            minIndex = j;
          }
        }
        if (minIndex !== i)
        {
          let temp = this._planes[i];
          this._planes[i] = this._planes[minIndex];
          this._planes[minIndex] = temp;
        }
      }
  }

  sortType(){
      for (let i = 0; i < this._planes.length - 1; i++)
      {
        let minIndex = i;
        for (let j = i + 1; j < this._planes.length; j++)
        {
          if (this._planes[j].type < this._planes[minIndex].type)
          {
            minIndex = j;
          }
        }
        if (minIndex !== i)
        {
          let temp = this._planes[i];
          this._planes[i] = this._planes[minIndex];
          this._planes[minIndex] = temp;
        }
      }
  }

  sortStatus(){
    let index = 0;
    for(let i = 0; i < this._planes.length;i++){    //run function for 29 times
      if (this._planes[index].status == "unavailable"){
        let temp = this._planes[index];
        this._planes.push(temp);
        this._planes.splice(index,1);
      }
      else {
        index++;
      }
    }
  }

  fromData(dataObject){
    let data = dataObject._planes;
    for(let i = 0; i < data.length; i++)
    {
      let plane = new Plane();
      plane.fromData(data[i]);
      this._planes.push(plane);
    }
  }
}
let planes = new PlaneList();
////////////////////
//************************* FUNCTIONS **************************//
function webServiceRequest(url,data){
	// Build URL parameters from data object.
    let params = "";
    // For each key in data object...
    for (let key in data)
    {
        if (data.hasOwnProperty(key))
        {
            if (params.length == 0)
            {
                // First parameter starts with '?'
                params += "?";
            }
            else
            {
                // Subsequent parameter separated by '&'
                params += "&";
            }

            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(data[key]);

            params += encodedKey + "=" + encodedValue;
         }
    }
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}
// Function to check if Data exists on local storage
function checkIfDataExistsLocalStorage(key){
	let data = localStorage.getItem(key);
  if (!data)
  {
    // Data doesn't exist
    return false;
  }
  else
  {
    // Data exists
    return true;
  }
}

// NOTE: Create a const as input parameter to key
function updateLocalStorage(key,data){
  let jsonString = JSON.stringify(data);
  localStorage.setItem(key,jsonString);
}

// NOTE:
//1. Create a const as input parameter to key
//2. Use a variable to catch return objectData
function getDataLocalStorage(key){
  let jsonString = localStorage.getItem(key);
  let objectData = JSON.parse(jsonString);
  return objectData;
}

function removeMarkers(markerArray) {
  if (markerArray !== null) {
    for (let i = markerArray.length - 1; i >= 0; i--) {
      markerArray[i].remove();
    }
  }
}
/////// Fleet ///////
function planeDataCallback(data){
  //API plane data list
  localStorage.setItem(PLANE_DATA_KEY, JSON.stringify(data));
  //Local MAIN plane data list
  let planeDataInLS = getDataLocalStorage(PLANE_DATA_KEY);
  for(let i = 0; i < planeDataInLS.airplanes.length; i++)
  {
    let inputParam = [];
    let data = planeDataInLS.airplanes[i];
    for(let prop in data)
    {
      inputParam.push(data[prop]);
    }
    if (planes.planes.length < planeDataInLS.airplanes.length)  //FIX: prevent duplicated data by planeDataBallback being called twice
    {
      planes.addPlane(inputParam);
    }
    else
    {
      break;
    }
  }
  updateLocalStorage(LOCAL_PLANE_DATA_KEY,planes);
}

function planesDummy(){
  let planes_1Data = getDataLocalStorage(LOCAL_PLANE_DATA_KEY);
  let planes_1 = new PlaneList();
  planes_1.fromData(planes_1Data);
  return planes_1;
}

function findPlane(planeRegistration){
	let plane = planesDummy();
	for( let i = 0; i< plane.planes.length; i++){
		if (plane.planes[i].registration == planeRegistration){
			let planeObj = plane.planes[i];
			return planeObj;
		}
	}

}
// Update fleet info functions
//1. fleetBooked(fleetRegistration) - update flight status -->*unavailable*, when a flight is scheduled
//2. fleetDelete(fleetRegistration) - restore flight status -->*available*, when a scheduled flight is deleted
//3. fleetComplete(fleetRegistration, newLoc) - update flight status --> *available*, and location of plane when flight is completed
function fleetBooked(fleetRegistration){
  let planes_1 = planesDummy();
  for (let i = 0; i < planes_1.planes.length; i++){
    if (planes_1.planes[i].registration == fleetRegistration){
      planes_1.planes[i].status = "unavailable";                //status update
      planes_1.planes[i].tempLoc = planes_1.planes[i].location; //store origin location
      break;
    }
  }
  updateLocalStorage(LOCAL_PLANE_DATA_KEY,planes_1);
}

function fleetDelete(fleetRegistration){
  let planes_1 = planesDummy();
  for (let i = 0; i < planes_1.planes.length; i++){
    if (planes_1.planes[i].registration == fleetRegistration){
      planes_1.planes[i].status = "available";                  //restore status
      planes_1.planes[i].location = planes_1.planes[i].tempLoc; //restore location
      break;
    }
  }
  updateLocalStorage(LOCAL_PLANE_DATA_KEY,planes_1);
}
//have to revise fleetComplete(), after completion of scheduling
function fleetComplete(fleetRegistration,newLoc){
  let planes_1 = planesDummy();
  for (let i = 0; i < planes_1.planes.length; i++){
    if (planes_1.planes[i].registration == fleetRegistration){
      planes_1.planes[i].status = "available";
      planes_1.planes[i].location = newLoc;
      break;
    }
  }
  updateLocalStorage(LOCAL_PLANE_DATA_KEY,planes_1);
}

////////////////////
//********************* RUN ON PAGE LOAD ***********************//
if ( checkIfDataExistsLocalStorage(PLANE_DATA_KEY) != true ) {
  // If local storage is empty, get plane info from API
  const PLANE_API_ENDPOINT = "https://eng1003.monash/api/v1/planes/";
  let planeData = {
    callback: "planeDataCallback"
  };
  webServiceRequest(PLANE_API_ENDPOINT, planeData);   //this line would store API data, "planes" data[local plane data]
}
// Arrays to hold markers
let redMarkers = [];
let blueMarkers = [];
let purpleMarkers = [];
let orangeMarkers = [];

//check if flight has started/completed
if (checkIfDataExistsLocalStorage(SCHEDULE_DATA_KEY) == true){
	let scheduleArray = getDataLocalStorage(SCHEDULE_DATA_KEY);
	let completedArray = [];
	let ongoingArray = [];
	let currentTime = Date.now()
	let indicator = 0;

	if (checkIfDataExistsLocalStorage(COMPLETED_DATA_KEY) == true){
		completedArray = getDataLocalStorage(COMPLETED_DATA_KEY);
	}
	if (checkIfDataExistsLocalStorage(ONGOING_DATA_KEY) == true){
		ongoingArray = getDataLocalStorage(ONGOING_DATA_KEY);
		for (let i = 0; i<ongoingArray.length; i++){
			if(currentTime>= ongoingArray[i].completeTime){
				ongoingArray.splice(i,1);
			}
		}
	}

	for (let i = 0; i<scheduleArray.length;i++){
		//complete time check
		if(currentTime >= scheduleArray[i].completeTime){
			fleetComplete(scheduleArray[i].plane.registration, scheduleArray[i].route.description);		//if error updating fleet status, check scheduleArray[i].plane.registration
			completedArray.push(scheduleArray[i]);
			scheduleArray.splice(i,1);
			indicator++;
		}
		//start time check
		else if(currentTime >= scheduleArray[i].startTime){
			ongoingArray.push(scheduleArray[i]);
			indicator++;
		}
	}
	if(indicator != 0){
		updateLocalStorage(SCHEDULE_DATA_KEY,scheduleArray);
		updateLocalStorage(COMPLETED_DATA_KEY, completedArray);
		updateLocalStorage(ONGOING_DATA_KEY,ongoingArray);
	}
}
