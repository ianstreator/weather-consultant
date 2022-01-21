import "./style.css";
import images from "./images/images.js";
import { doc } from "prettier";

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

function createForecastCards(
  weekday,
  temp,
  icon,
  description,
  tempHigh,
  tempLow,
  sunrise,
  sunset,
  windSpeed,
  windDirection
) {
  //....create forecast card.........
  const card = document.createElement("div");
  card.classList.add("card");

  //.....create front of card.........
  const h1 = document.createElement("h1");
  h1.append(weekday);
  const h2 = document.createElement("h2");
  h2.append(temp);
  const img = document.createElement("img");
  img.setAttribute("alt", true);
  img.alt = description;
  img.setAttribute("src", true);
  img.src = icon;
  const p = document.createElement("p");
  p.append(description);

  const cardFront = document.createElement("div");
  cardFront.append(h1, h2, img, p);
  cardFront.classList.add("front");

  //....create back of card..........
  const high = document.createElement("h1");
  high.textContent = ``;
  const low = document.createElement("h1");

  const rise = document.createElement("div");
  const riseIMG = document.createElement("img");
  const riseTime = document.createElement("p");

  const set = document.createElement("div");
  const setIMG = document.createElement("img");
  const setTime = document.createElement("p");

  const wind = document.createElement("div");
  wind.append(windSpeed, windDirection, images.forecastCardBackIcons.wind, images.forecastCardBackIcons.winddir);

  const cardBack = document.createElement("div");
  cardBack.append(high, low, rise, set, wind);
  cardBack.classList.add("back", "hidden");

  card.append(cardFront, cardBack);
  forecastContainer.append(card);

  card.addEventListener("click", () => {
    if (card.classList.contains("back")) {
      card.classList.remove("back"), card.classList.add("front");
      cardBack.classList.add("hidden");
      cardFront.classList.remove("hidden");
    } else {
      card.classList.add("back"), card.classList.remove("front");
      cardFront.classList.add("hidden");
      cardBack.classList.remove("hidden");
    }
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
    BASE_URL = "https://weather-consultant.herokuapp.com";
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
    const icon = images.weatherIcons[json.current.weather[0].icon];
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
      const icon = images.weatherIcons[e.weather[0].icon];
      const date = new Date(e.dt * 1000);
      const day = daysOfTheWeek[date.getDay()];
      const description = e.weather[0].description;
      const temp = `${Math.round(e.temp.day)}°`;
      const windSpeed = `${Math.round(e.wind_speed)}`;
      const windDirection = e.wind_deg;
      const tempHigh = `${Math.ceil(e.temp.day)}°`;
      const tempLow = `${Math.floor(e.temp.day)}°`;
      const sunRise = e.sunrise;
      const sunSet = e.sunset;

      createForecastCards(
        day,
        temp,
        icon,
        description,
        tempHigh,
        tempLow,
        sunRise,
        sunSet,
        windSpeed,
        windDirection
      );

      // createForecastCardsBack();
    });
  } catch (error) {
    console.error(error);
  }
})();
