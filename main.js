import './style.scss'
const currentLocation = document.getElementById('current-location');
const currentTemp = document.getElementById('current-temp');
const currentIcon = document.getElementById('current-icon');
const currentDescription = document.getElementById('current-description');
const forecastContainer = document.getElementById('forecast-container')


function appendDataToCurrentCard(location, temperature, icon, description) {
  currentLocation.append(location)
  currentTemp.append(temperature)
  currentIcon.src = icon
  currentDescription.append(description)
}

function createForecastCards(weekday, temperature, icon, description) {
  const h1 = document.createElement('h1')
  h1.append(weekday)
  const h2 = document.createElement('h2')
  h2.append(temperature)
  const img = document.createElement('img')
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


    const location = json.location.name
    const temp = json.current.temp_f
    const icon = json.current.condition.icon
    const description = json.current.condition.text
    appendDataToCurrentCard(location, temp, icon, description)


    const forecast = json.forecast.forecastday.forEach(e => {
      const day = 'hello'
      const temp = e.day.avgtemp_f
      const icon = e.day.condition.icon
      const description = e.day.condition.text

      createForecastCards(day, temp, icon, description)
    })

    console.log(json)
    console.log(forecast)
  } catch (error) {
    console.error(error)
  }
})();

