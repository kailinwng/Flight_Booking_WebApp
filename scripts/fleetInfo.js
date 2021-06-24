/////////////////////////////DO NOT MAKE ANY CHANGES TO THIS CODE, COMMENT /* {your suggested fix} */ IF NECCESSARY///////////////////////////////////////////
/////////////// THINGS TO KNOW ///////////////////////
// all changes made from other pages would be updated to the key: "planes" (Use LOCAL_PLANE_DATA_KEY)
// planes_1 is a class that would be only created once fleetInfo.html is loaded by extracting data from LOCAL_PLANE_DATA_KEY, and is NOT STORED in LS
// all sorting function would only be performed on planes_1
// all display in fleetInfo.html are performed by using planes_1 & fleetInfoDisplay()

//Fleet info page keys
const STATUSKEY = "statusKey";
const FLEETSORTKEY = "fleetSortKey";
const FLEETSORTDATA = "fleetSortData";

//Functions
//data must be instance of PlaneList
function fleetInfoDisplay(data){
  let fleetDisplayRef = document.getElementById("fleetDisplay");
  let fleetDisplay = "";
  let planesArray = data.planes;
  for(let i = 0; i<planesArray.length; i++){
    fleetDisplay+= "<tr>";
    if(planesArray[i].status == "available"){
      fleetDisplay+= `<td><img src="images/green-dot.jpg"  height=13px width=18px class="dot"></td>`;
    }
    else{
      fleetDisplay+= `<td><img src="images/grey-dot.jpg"  height=13px width=18px class="dot"></td>`;
    }
    fleetDisplay+= `<td class="mdl-data-table__cell--non-numeric">${planesArray[i].registration}</td>`;
    fleetDisplay+= `<td class="mdl-data-table__cell--non-numeric">${planesArray[i].location}</td>`;
    fleetDisplay+= `<td>${planesArray[i].range}</td>`;
    fleetDisplay+= `<td>${planesArray[i].avgSpeed}</td>`;
    fleetDisplay+= `<td class="mdl-data-table__cell--non-numeric">${planesArray[i].type}</td>`;
    fleetDisplay+= `<td class="mdl-data-table__cell--non-numeric">${planesArray[i].airline}</td>`;
    fleetDisplay+= "</tr>";
  }
  fleetDisplayRef.innerHTML = fleetDisplay;
}

//******************* SORTING *******************//
function sortByAirline(){
  let planes_1 = planesDummy();
  planes_1.sortAirline();
  fleetInfoDisplay(planes_1);
  updateLocalStorage(FLEETSORTDATA, planes_1);
  updateLocalStorage(FLEETSORTKEY, "airline");
  if(getDataLocalStorage(STATUSKEY) == "sorted"){
    updateLocalStorage(STATUSKEY,"default");  //activate sort
    statusSort();
  }
}

function sortByPlaneType(){
  let planes_1 = planesDummy();
  planes_1.sortType();
  fleetInfoDisplay(planes_1);
  updateLocalStorage(FLEETSORTDATA, planes_1);
  updateLocalStorage(FLEETSORTKEY, "type");
  if(getDataLocalStorage(STATUSKEY) == "sorted"){
    updateLocalStorage(STATUSKEY,"default");  //activate sort
    statusSort();
  }
}
//statusSort() includes display
function statusSort(){
  if(checkIfDataExistsLocalStorage(STATUSKEY) == false || getDataLocalStorage(STATUSKEY) == "default"){   //if STATUS button is not activated
    if (checkIfDataExistsLocalStorage(FLEETSORTKEY) == true){       //if data is sorted before
      let planes_1Data = getDataLocalStorage(FLEETSORTDATA);        //get the sorted data
      let planes_1 = new PlaneList();
      planes_1.fromData(planes_1Data);
      planes_1.sortStatus();
      fleetInfoDisplay(planes_1);
      updateLocalStorage(STATUSKEY,"sorted");
    }
    else{                                                           //if data is not sorted before
      let planes_1 = planesDummy();
      planes_1.sortStatus();
      fleetInfoDisplay(planes_1);
      updateLocalStorage(STATUSKEY,"sorted");
    }
  }
  else{ //if STATUS button is activated
    if (checkIfDataExistsLocalStorage(FLEETSORTKEY) == true){       //if data is sorted before
      let planes_1Data = getDataLocalStorage(FLEETSORTDATA);        //get the sorted data
      let planes_1 = new PlaneList();
      planes_1.fromData(planes_1Data);
      fleetInfoDisplay(planes_1);
      updateLocalStorage(STATUSKEY, "default");
    }
    else{                                                           //if data is not sorted before
      let planes_1 = planesDummy();
      fleetInfoDisplay(planes_1);
      updateLocalStorage(STATUSKEY, "default");
    }
  }
}

//*********************************Run upon load********************************************//
if ( checkIfDataExistsLocalStorage(PLANE_DATA_KEY) == true )
{
  if(checkIfDataExistsLocalStorage(FLEETSORTKEY) == false){
    let planes_1 = planesDummy();
    fleetInfoDisplay(planes_1);
  }
  else{                                                   //everytime fleetInfo.html loads, data is sorted according to previous action;
    if (getDataLocalStorage(FLEETSORTKEY) == "airline"){
      sortByAirline();
    }
    else{
      sortByPlaneType();
    }
    if (getDataLocalStorage(STATUSKEY) == "sorted"){
      updateLocalStorage(STATUSKEY,"default");    //update to default so that statusSort would show status sorted data
      statusSort();
    }
  }
}
else
{
  // If local storage is empty, get plane info from API
  const PLANE_API_ENDPOINT = "https://eng1003.monash/api/v1/planes/";
  let planeData = {
    callback: "planeDataCallback"
  };
  webServiceRequest(PLANE_API_ENDPOINT, planeData);
}
