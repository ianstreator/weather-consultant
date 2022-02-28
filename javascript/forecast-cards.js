const forecastContainer = document.getElementById("forecast-container");
import images from "../images/images.js";
import dateAndTime from "./date-and-time.js";

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

  //....appending to front of card.....
  const cardFront = document.createElement("div");
  cardFront.append(h1, h2, img, p);
  cardFront.classList.add("front");

  //....create back of card..........
  const high = document.createElement("h1");
  high.textContent = `${tempHigh}`;
  const low = document.createElement("h1");
  low.textContent = `${tempLow}`;
  low.style.cssText = "opacity:0.65";

  //.....back of card sunrise....
  const rise = document.createElement("div");
  rise.classList.add("sun");
  const riseIMG = document.createElement("img");
  riseIMG.src = `${images.forecastCardBackIcons.sunrise}`;
  const riseTime = document.createElement("h1");
  riseTime.textContent = dateAndTime.time(sunrise).time;
  rise.append(riseIMG, riseTime);

  //....back of card sunset.....
  const set = document.createElement("div");
  set.classList.add("sun");
  const setIMG = document.createElement("img");
  setIMG.src = `${images.forecastCardBackIcons.sunset}`;
  const setTime = document.createElement("h1");
  setTime.textContent = dateAndTime.time(sunset).time;
  set.append(setIMG, setTime);

  //....back of card wind....
  const wind = document.createElement("div");
  const windIMG = document.createElement("img");
  windIMG.src = `${images.forecastCardBackIcons.wind}`;
  windIMG.classList.add("wind-main");
  const windDIR = document.createElement("img");
  windDIR.style.cssText = `transform: rotateZ(${windDirection}deg)`;
  windDIR.classList.add("wind-direction");
  windDIR.src = `${images.forecastCardBackIcons.winddir}`;
  const speed = document.createElement("h1");
  speed.textContent = `${windSpeed}`;
  if (windSpeed.toString().length < 2)
    speed.style.cssText = "margin-left:1.5rem";
  wind.append(speed, windIMG, windDIR);
  wind.classList.add("wind");

  //....appending to back of card....
  const cardBack = document.createElement("div");
  cardBack.append(high, low, rise, set, wind);
  cardBack.classList.add("back");

  //....appending card fron and card back to main card element....
  card.append(cardBack, cardFront);
  forecastContainer.append(card);

  //....card event listener to flip between front and back....
  card.addEventListener("click", () => {
    card.classList.contains("flip")
      ? card.classList.remove("flip")
      : card.classList.add("flip");
  });
}

export default { createForecastCards };
