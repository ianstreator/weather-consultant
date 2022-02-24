const currentTemp = document.getElementById("current-temp");
const currentIcon = document.getElementById("current-icon");
const currentDescription = document.getElementById("current-description");

function appendDataToCurrentCard(weatherData, icon) {
  currentTemp.append(weatherData.temp);
  currentIcon.setAttribute("alt", true);
  currentIcon.alt = weatherData.description;
  currentIcon.setAttribute("src", true);
  currentIcon.src = icon;
  currentDescription.append(weatherData.description);
}

export default { appendDataToCurrentCard };
