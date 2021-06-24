function distance(point1,point2)
//function parameters will be an array with [longitude,latitude]
{
  let lat1= point1[1];
  let lon1= point1[0];
  let lat2= point2[1];
  let lon2= point2[0];

  const RADIUS = 6371e3; // metres
  const LAT1_RAD = lat1 * Math.PI/180; // φ, λ in radians
  const LAT2_RAD = lat2 * Math.PI/180;
  const LAT_DIST = (lat2-lat1) * Math.PI/180;
  const LON_DIST = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(LAT_DIST/2) * Math.sin(LAT_DIST/2) +
            Math.cos(LAT1_RAD) * Math.cos(LAT2_RAD) *
            Math.sin(LON_DIST/2) * Math.sin(LON_DIST/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = (RADIUS * c)/1000; // in km

  return parseFloat(distance);
}

//calculate duration before adding into class
function duration(distancekm,speed){
  //1 knot = 0.514444
  let velocity = speed*0.514444;	//knot to meter/s-1
  let distance = distancekm*1000;	//km to meter
  let duration = distance/velocity;	//
  return Math.round(duration);
}

//Weather API
const WEATHER_API_USER= "kwon0061";
const WEATHER_API_KEY= "0343ed5f0954bf3e4e32a8d63f8cfbd7";
const WEATHER_API_ENDPOINT= "https://eng1003.monash/api/v1/darksky/";
const WEATHER_DATA_KEY = "weatherData";

function getCurrentWeather(lng,lat,exclude=["daily","minutely","hourly"])
{
  let url= WEATHER_API_ENDPOINT;
  let data={
    u: WEATHER_API_USER,
    key: WEATHER_API_KEY,
    lat: lat,
    lng: lng,
    exclude: exclude,
    callback: "weatherCallback"
  };
  webServiceRequest(url,data);
}

function getHistoricalWeather(lng,lat,time,exclude=["daily","minutely","hourly"])   //time: unix timestamp (time in the past)
{
  let url= WEATHER_API_ENDPOINT;
  let data={
    u: WEATHER_API_USER,
    key: WEATHER_API_KEY,
    lat: lat,
    lng: lng,
    time: time,
    exclude: exclude,
    callback: "weatherCallback"
  };
  webServiceRequest(url,data);
}

function weatherCallback(data)
{
  updateLocalStorage(WEATHER_DATA_KEY,data);
  let weather = getDataLocalStorage(WEATHER_DATA_KEY);
}
