exports.handler = (event, context, callback) => {
  const axios = require('axios');
  const IsraeliCities = require('./israelis_cities.json');

  const API_KEY = event.api_key;
  const city_name = event.city_name;
  // convert city name to Title Case - that is the naming convention in the cities file.
  const toTitleCase = (str) => str.replace(/\w\S*/g, txt => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  // grab the object containing the city name and get it's id (city code).
  let cityCode = IsraeliCities.filter(item => item.name === toTitleCase(city_name))[0].id;

  if(!cityCode || !city_name || ! API_KEY) callback("Error");
  
  let URL = `http://api.openweathermap.org/data/2.5/weather?id=${city_code}&appid=${API_KEY}&units=metric`;

  // call api with api key and city code.
  axios.get(URL)
      .then(res => {
        if(res.status !== 200) callback("Error");
        else{
          // building json response according to the model that was specified.
          let json_res = {
            "location": {
              "name": res.data.name,
              "lat": res.data.coord.lat,
              "lng": res.data.coord.lon
            },
            "weather": {
              "temperature": res.data.main.temp,
              "humidity": res.data.main.humidity,
              "description": res.data.weather[0].description,
              "wind": {
                "speed": res.data.wind.speed,
                "degree": res.data.wind.deg
              },
              "clouds": res.data.clouds.all,
              "icon": res.data.weather[0].icon
            }
          };
          callback(null ,json_res);
        }
      }).catch(err => callback(err));
};
