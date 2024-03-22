import { format } from 'date-fns';
import {
  getWeather,
  convertToCelsius,
  convertToFahrenheit,
  round,
} from './weather';
import './style.css';

function unitConversion() {
  const buttons = document.querySelectorAll('.profile button');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.className === 'active') return;

      // convert to unit
      const degrees = document.querySelectorAll('.degrees');

      degrees.forEach((degree) => {
        degree.textContent =
          btn.name === 'celsius'
            ? convertToCelsius(degree.textContent)
            : convertToFahrenheit(degree.textContent);
      });

      // get active unit
      const activeTemp = document.querySelector('.profile button.active');
      activeTemp.className = '';
      btn.className = 'active';
    });
  });
}

function render(forecast, container) {
  forecast.forEach((timeline) => {
    const currentTime = timeline.date || timeline.time;

    // create grid item
    const item = document.createElement('div');
    const dayTime = document.createElement('div');
    const condition = document.createElement('img');
    const temp = document.createElement('div');
    const maximal = document.createElement('span');
    const minimal = document.createElement('span');
    const maxDegrees = document.createElement('span');
    const minDegrees = document.createElement('span');
    const unit = document.querySelector('.profile button.active');

    if (container.id === 'daily') {
      dayTime.textContent = format(currentTime, 'E');
      condition.src = timeline.day.condition.icon;
      condition.alt = timeline.day.condition.text;

      const maxTemp =
        unit.name === 'celsius'
          ? timeline.day.maxtemp_c
          : timeline.day.maxtemp_f;

      const minTemp =
        unit.name === 'celsius'
          ? timeline.day.mintemp_c
          : timeline.day.mintemp_f;

      maxDegrees.textContent = round(maxTemp);
      minDegrees.textContent = round(minTemp);
    } else {
      dayTime.textContent = format(currentTime, 'HH:mm');
      condition.src = timeline.condition.icon;
      condition.alt = timeline.condition.text;

      const maxTemp =
        unit.name === 'celsius' ? timeline.temp_c : timeline.temp_f;

      maxDegrees.textContent = round(maxTemp);
    }

    maxDegrees.className = 'degrees';
    minDegrees.className = 'degrees';
    maximal.className = 'maximal';
    minimal.className = 'minimal';
    temp.className = 'temp';
    dayTime.className = 'day';
    item.className = 'item';

    maximal.appendChild(maxDegrees);
    maximal.innerHTML += '°';

    temp.appendChild(maximal);

    if (container.id === 'daily') {
      minimal.appendChild(minDegrees);
      minimal.innerHTML += '°';
      temp.innerHTML += ' ';
      temp.appendChild(minimal);
    }

    item.appendChild(dayTime);
    item.appendChild(condition);
    item.appendChild(temp);
    container.appendChild(item);
  });
}

function displayForecast(data) {
  const hourly = document.getElementById('hourly');
  const daily = document.getElementById('daily');

  hourly.innerHTML = '';
  daily.innerHTML = '';

  render(
    data.forecast[0].hour.filter(
      (h) => new Date(h.time) > new Date(data.current.last_updated)
    ),
    hourly
  );
  render(data.forecast, daily);
}

function displayHighlights(today) {
  const uv = document.querySelector('.uv');
  const wind = document.querySelector('.wind .large');
  const windDirection = document.querySelector('.wind .direction');
  const sunriseTime = document.querySelector('.sunrise .time');
  const sunsetTime = document.querySelector('.sunset .time');
  const humidity = document.querySelector('.humidity .large');
  const visibility = document.querySelector('.visibility .large');
  const airIndex = document.querySelector('.air .large');
  const airComment = document.querySelector('.air .comment');

  const airQualityMeanings = {
    1: 'Good',
    2: 'Moderate',
    3: 'Unhealthy for sensitive group',
    4: 'Unhealthy',
    5: 'Very Unhealthy',
    6: 'Hazardous',
  };

  uv.textContent = today.current.uv;
  wind.textContent = today.current.wind_kph;
  windDirection.textContent = today.current.wind_dir;
  sunriseTime.textContent = today.forecast.astro.sunrise;
  sunsetTime.textContent = today.forecast.astro.sunset;
  humidity.textContent = today.current.humidity;
  visibility.textContent = today.current.vis_km;
  airIndex.textContent = today.current.air_quality['us-epa-index'];
  airComment.textContent =
    airQualityMeanings[today.current.air_quality['us-epa-index']];
}

const form = document.querySelector('form');
const currentWeather = document.querySelector('.current');
const currentIcon = currentWeather.querySelector('img');
const currentTemp = currentWeather.querySelector('.degrees');
const currentDay = currentWeather.querySelector('.day');
const currentTime = currentWeather.querySelector('.time');
const currentCondition = document.querySelector('.condition');
const currentRain = document.querySelector('.rain');
const currentLocation = document.querySelector('.location');
const unit = document.querySelector('.profile button.active');

form.addEventListener('submit', (e) => {
  const location = form.location.value;

  getWeather(location)
    .then((data) => {
      // render Sidebar info
      const iconUrl = data.current.condition.icon
        .split('64x64')
        .join('128x128');

      currentIcon.src = iconUrl;
      currentTemp.textContent =
        unit.name === 'celsius' ? data.current.temp_c : data.current.temp_f;
      currentDay.textContent = format(data.current.last_updated, 'EEEE');
      currentTime.textContent = format(data.current.last_updated, 'p');

      currentCondition.textContent = data.current.condition.text;
      currentRain.textContent = `Rain - ${data.forecast[0].day.daily_chance_of_rain}%`;

      currentLocation.textContent = `${data.location.name}, ${data.location.country}`;

      // render Forecast grid
      displayForecast(data);

      // render Today highlights
      displayHighlights({ current: data.current, forecast: data.forecast[0] });
    })
    .catch((error) => console.error(error));

  e.preventDefault();
});

const tabs = document.querySelectorAll('nav button');
const hourly = document.getElementById('hourly');
const daily = document.getElementById('daily');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.className === 'active') return;

    // display tab forecast
    const activeTab = document.querySelector('nav button.active');
    hourly.classList.toggle('hidden');
    daily.classList.toggle('hidden');

    // get active tab
    activeTab.className = '';
    tab.className = 'active';
  });
});

unitConversion();
