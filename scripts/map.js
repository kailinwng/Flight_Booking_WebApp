// Creating Map
mapboxgl.accessToken = "pk.eyJ1IjoidGVhbWFjYzY5NDIwIiwiYSI6ImNrYTE1YmdzejB2ZmkzaG52N2swY2RycGcifQ.Z-FH8UOPeQH155J-xFiKsg";
let map = new  mapboxgl.Map({
	 container: 'map',
	center: [144.9648731,-37.8182711],
	zoom: 1.5,
	style: 'mapbox://styles/mapbox/streets-v9',
	logoPosition: 'top-left'
});

// Function onclick, will pan to selected coordinates
function panToLocation(lng, lat) {
  let location = [lng, lat];
	map.panTo(location);
}
// Function to get Airport in a country
function airportCountry(country) {
  let airportUrl = "https://eng1003.monash/api/v1/airports/";
  let airportData = {
    country: country,
    callback: "displayAirport"
  };
  webServiceRequest(airportUrl, airportData);
}

// Function to get Airport in a city
function airportCity(country, city) {
  let airportUrl = "https://eng1003.monash/api/v1/airports/";
  let airportData = {
    country: country,
    city: city,
    callback: "displayAirport"
  };
  webServiceRequest(airportUrl, airportData);
}

// Function to get nearby Airport
function getNearbyAirport(lat, lng, range){
  let airportUrl = "https://eng1003.monash/api/v1/airports/";
  let airportData = {
    lat: lat,
    lng: lng,
    range: range,
    callback: "displayAirport"
  };
  webServiceRequest(airportUrl, airportData);
}

// Function to display airports
function displayAirport(data)	{
  let locations = [];
  for (let i = 0; i < data.length; i++)		{
    locations[i] = {
      coordinates: [data[i].longitude, data[i].latitude],
      description: data[i].name
  };}
  panToLocation(data[0].longitude, data[0].latitude);
}
// Functions on page load
