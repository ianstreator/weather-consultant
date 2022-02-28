import "./style.css";
import images from "./images/images.js";
import currentCard from "./javascript/current-card";
import forecastCards from "./javascript/forecast-cards";
import dateAndTime from "./javascript/date-and-time";
import geoLocator from "./javascript/geo-locator";

const body = document.querySelector("body");
const title = document.querySelector("title");
const faviconLink = document.querySelector("link");

const clock = document.getElementById("time");
const area = document.getElementById("area");
const Quote = document.getElementById("quote");
const QuoteAuthor = document.getElementById("quote-author");

//....setting clock and calendar....
clock.textContent = dateAndTime.time().time;
date.textContent = dateAndTime.time().month_day_year;
//....updating clock and calendar....
setInterval(() => {
  clock.textContent = dateAndTime.time().time;
  date.textContent = dateAndTime.time().month_day_year;
}, 30000);

(async () => {
  // await getCoordinates();
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
      body: JSON.stringify(await geoLocator.getCoordinates()),
    };
    const res = await fetch(`${BASE_URL}/forecast`, options);
    let { city, json, background, quote } = await res.json();

    //...setting quote....
    Quote.innerHTML = quote[0];
    QuoteAuthor.innerHTML = `-${quote[1]}`;

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
    currentCard.appendDataToCurrentCard(weatherData, icon);

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
      const tempHigh = `H: ${Math.ceil(e.temp.max)}°`;
      const tempLow = `L: ${Math.floor(e.temp.min)}°`;
      const sunRise = e.sunrise * 1000;
      const sunSet = e.sunset * 1000;

      forecastCards.createForecastCards(
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
    });
  } catch (e) {
    console.error(e);
  }
})();
