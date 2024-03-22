const key = process.env.API_KEY;

function processData(data) {
  const location = {
    name: data.location.name,
    region: data.location.region,
    country: data.location.country,
    localtime: data.location.localtime,
  };

  const current = {
    condition: data.current.condition,
    temp_c: data.current.temp_c,
    temp_f: data.current.temp_f,
    is_day: data.current.is_day,
    wind_kph: data.current.wind_kph,
    wind_dir: data.current.wind_dir,
    vis_km: data.current.vis_km,
    humidity: data.current.humidity,
    uv: data.current.uv,
    air_quality: data.current.air_quality,
    last_updated: data.current.last_updated,
  };

  return { location, current, forecast: data.forecast.forecastday };
}

async function getWeather(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=3&aqi=yes&alerts=no
        `,
      { mode: 'cors' }
    );

    const result = await response.json();
    return processData(result);
  } catch (error) {
    return error;
  }
}

function convertToCelsius(tempInFahrenheit) {
  return Math.round((((tempInFahrenheit - 32) * 5) / 9) * 1) / 1;
}

function convertToFahrenheit(tempInCelsius) {
  return Math.round((tempInCelsius * 9) / 5 + 32 * 1) / 1;
}

function round(temp) {
  return Math.round(temp * 1) / 1;
}

export { getWeather, convertToCelsius, convertToFahrenheit, round };
