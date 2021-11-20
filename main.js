import './style.scss'
const currentLocation = document.getElementById('current-location');
const currentTemp = document.getElementById('current-temp');
const currentIcon = document.getElementById('current-icon');
const currentDescription = document.getElementById('current-description');
const forecastContainer = document.getElementById('forecast-container')


function appendDataToCurrentCard(weatherData, icon) {
  currentLocation.append(weatherData.location)
  currentTemp.append(weatherData.temp)
  currentIcon.setAttribute('src', true)
  currentIcon.src = icon
  currentDescription.append(weatherData.description)
}

function createForecastCards(weekday, temperature, icon, description) {
  const h1 = document.createElement('h1')
  h1.append(weekday)
  const h2 = document.createElement('h2')
  h2.append(temperature)
  const img = document.createElement('img')
  img.setAttribute('src', true)
  img.src = icon
  const p = document.createElement('p')
  p.append(description)
  const card = document.createElement('div')
  card.classList.add('weekday')
  card.append(h1, h2, img, p)

  forecastContainer.append(card)
}

(async () => {
  let BASE_URL = '';
  if (window.location.host.includes('localhost')) {
    BASE_URL = 'http://localhost:4000'
  }
  try {
    const res = await fetch(`${BASE_URL}/forecast`)
    const json = await res.json();
    const weatherImages = {
      'Sunny': './weather-images/Sunny.svg',
      'Cloudy': './weather-images/Cloudy.svg',
      'Clear': './weather-images/Moon.svg'
    }
    const weatherData = {
      location: json.location.name,
      temp: json.current.temp_f,
      description: json.current.condition.text,

    }
    const icon = weatherImages[weatherData.description]
    console.log(icon)

    appendDataToCurrentCard(weatherData, icon)
    console.log(json.current.temp_f)
    const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    json.forecast.forecastday.forEach(e => {
      const date = new Date(e.date_epoch * 1000)

      const day = daysOfTheWeek[date.getDay()]
      const temp = e.day.avgtemp_f
      let icon
      const description = e.day.condition.text

      if (weatherImages[description]) icon = weatherImages[description]

      createForecastCards(day, temp, icon, description)
    })

  } catch (error) {
    console.error(error)
  }
})();

