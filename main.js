import "./style.scss";
import images from "./images/images.js";

const currentLocation = document.getElementById("current-location");
const currentTemp = document.getElementById("current-temp");
const currentIcon = document.getElementById("current-icon");
const currentDescription = document.getElementById("current-description");
const forecastContainer = document.getElementById("forecast-container");
const body = document.querySelector("body");
const title = document.querySelector("title");
const faviconLink = document.querySelector("link");

function appendDataToCurrentCard(weatherData, icon) {
  currentLocation.append(weatherData.location);
  currentTemp.append(weatherData.temp);
  currentIcon.setAttribute("alt", true);
  currentIcon.alt = weatherData.description;
  currentIcon.setAttribute("src", true);
  currentIcon.src = icon;
  currentDescription.append(weatherData.description);
}

function createForecastCards(weekday, temperature, icon, description) {
  const h1 = document.createElement("h1");
  h1.append(weekday);
  const h2 = document.createElement("h2");
  h2.append(temperature);
  const img = document.createElement("img");
  img.setAttribute("alt", true);
  img.alt = description;
  img.setAttribute("src", true);
  img.src = icon;
  const p = document.createElement("p");
  p.append(description);
  const card = document.createElement("div");
  card.classList.add("weekday");
  card.append(h1, h2, img, p);

  forecastContainer.append(card);
}
//.....asking user if the website can use their location....
let location = {};
async function getCoordinates() {
  const pos = await new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
  location.lat = pos.coords.latitude;
  location.lon = pos.coords.longitude;
}

(async () => {
  await getCoordinates();
  let BASE_URL = "";
  if (window.location.host.includes("localhost")) {
    BASE_URL = "http://localhost:4000";
  } else {
    BASE_URL = "https://my-local-weather-app.herokuapp.com";
  }

  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    };
    const res = await fetch(`${BASE_URL}/forecast`, options);
    let { json, background } = await res.json();

    //....setting website background image........
    if (background === "defaults") {
      Math.random() < 0.5
        ? (background = images.elephant)
        : (background = images.frog);
    }
    body.style.cssText = `background-image: url(${background});`;

    //.....website title and favicon........
    const town = json.location.name;
    const region = json.location.region;
    title.text = `${town} ${region}`;
    const icon = json.current.condition.icon;
    faviconLink.href = icon;

    //....data for current day card.....
    const weatherData = {
      location: json.location.name,
      temp: json.current.temp_f,
      description: json.current.condition.text,
    };
    appendDataToCurrentCard(weatherData, icon);

    const daysOfTheWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    //....data for forecast day cards.....
    json.forecast.forecastday.forEach((e) => {
      const icon = e.day.condition.icon;
      const date = new Date(e.date_epoch * 1000);
      const day = daysOfTheWeek[date.getDay()];
      const temp = e.day.avgtemp_f;
      const description = e.day.condition.text;

      createForecastCards(day, temp, icon, description);
    });
  } catch (error) {
    console.error(error);
  }
})();
