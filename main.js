import "./style.css";
import images from "./images/images.js";

const currentTemp = document.getElementById("current-temp");
const currentIcon = document.getElementById("current-icon");
const currentDescription = document.getElementById("current-description");
const forecastContainer = document.getElementById("forecast-container");
const body = document.querySelector("body");
const title = document.querySelector("title");
const faviconLink = document.querySelector("link");
const clock = document.getElementById("time");
const area = document.getElementById("area");

function appendDataToCurrentCard(weatherData, icon) {
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
  card.addEventListener("click", () => {
    // card.style.cssText = "background-color:black;transform: rotateY(180deg);";
    card.classList.contains("extra-stats")
      ? card.classList.remove("extra-stats")
      : card.classList.add("extra-stats");
  });
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

const time = () => {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  const am_pm = hours < 12 ? "AM" : "PM";
  if (minutes < 10) minutes = `0${minutes}`;
  if (hours > 12) hours = hours - 12;
  else if (hours === 0) hours = 12;

  const time = `${hours}:${minutes} ${am_pm}`;
  const DMY = `${date.getMonth() + 1}/${date.getDate()}/${
    date.getFullYear() - 2000
  }`;
  const timeAndDate = { time, DMY };
  return timeAndDate;
};
//....setting clock and calendar....
clock.textContent = time().time;
date.textContent = time().DMY;
//....updating clock and calendar....
setInterval(() => {
  clock.textContent = time().time;
  date.textContent = time().DMY;
}, 30000);

(async () => {
  await getCoordinates();
  console.log(location);
  let BASE_URL = "";
  if (window.location.host.includes("localhost")) {
    BASE_URL = "http://localhost:4000";
  } else {
    BASE_URL = "https://my-local-weather-app.herokuapp.com";
  }
  const daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    };
    const res = await fetch(`${BASE_URL}/forecast`, options);
    let { city, json, background } = await res.json();
    console.log(json);
    console.log(city);
    console.log(background);

    //....setting website background image........
    if (background === "defaults") {
      Math.random() < 0.5
        ? (background = images.elephant)
        : (background = images.frog);
    }
    body.style.cssText = `background-image: url(${background});`;
    //.....website title and favicon........
    title.text = `${city}'s weather`;
    area.innerHTML = `${city}`;
    const icon = images.map[json.current.weather[0].icon];
    faviconLink.href = icon;

    //....data for current day card.....
    const weatherData = {
      temp: `${Math.round(json.current.temp)}°`,
      description: json.current.weather[0].description,
    };
    appendDataToCurrentCard(weatherData, icon);

    //....data for forecast day cards.....
    json.daily.forEach((e, i) => {
      if (i > 6) return;
      const icon = images.map[e.weather[0].icon];
      const date = new Date(e.dt * 1000);
      const day = daysOfTheWeek[date.getDay()];
      const description = e.weather[0].description;
      const temp = `${Math.round(e.temp.day)}°`;

      createForecastCards(day, temp, icon, description);
    });
  } catch (error) {
    console.error(error);
  }
})();
