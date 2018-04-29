exports.handler = (event, context, callback) => {
  const axios = require('axios');
  const IsraeliCities = require('./israelis_cities.json');

  const API_KEY = event.api_key;
  const city_name = event.city_name;
  let cityCode = IsraeliCities.filter(item => item.name === city_name)[0].id;

  if(!cityCode || !city_name || ! API_KEY) callback("Error");
  let URL = `http://api.openweathermap.org/data/2.5/weather?id=${city_code}&appid=${API_KEY}&units=metric`;


  axios.get(URL)
      .then(res => {
        if(res.status !== 200) callback("Error");
        else{
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
