import './style.scss'
const currentLocation = document.getElementById('current-location');
const currentTemp = document.getElementById('current-temp');
const currentIcon = document.getElementById('current-icon');
const currentDescription = document.getElementById('current-description');


function appendDataToCurrentCard(location, temperature, icon, description) {
  currentLocation.append(location)
  currentTemp.append(temperature)
  currentIcon.src=icon
  currentDescription.append(description)
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

    console.log(json)
  } catch (error) {
    console.error(error)
  }
})();

