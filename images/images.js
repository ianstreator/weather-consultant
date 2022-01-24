import elephant from "./baby-elephant.jpg";
import frog from "./jungle-frog.jpg";
import clearSkyDay from "./01d.png";
import clearSkyNight from "./01n.png";
import fewCloudsDay from "./02d.png";
import fewCloudsNight from "./02n.png";
import scatteredCloudsDay from "./03d.png";
import scatteredCloudsNight from "./03n.png";
import brokenCloudsDay from "./04d.png";
import brokenCloudsNight from "./04n.png";
import showerRainDay from "./09d.png";
import showerRainNight from "./09n.png";
import rainDay from "./10d.png";
import rainNight from "./10n.png";
import thunderstormDay from "./11d.png";
import thunderstormNight from "./11n.png";
import snowDay from "./13d.png";
import snowNight from "./13n.png";
import mistDay from "./50d.png";
import mistNight from "./50n.png";

import sunRise from "./sunrise.svg";
import sunSet from "./sunset.svg";
import windDir from "./wind-direction.svg";
import wind from "./wind.svg";

const weatherIcons = {
  "01d": clearSkyDay,
  "01n": clearSkyNight,
  "02d": fewCloudsDay,
  "02n": fewCloudsNight,
  "03d": scatteredCloudsDay,
  "03n": scatteredCloudsNight,
  "04d": brokenCloudsDay,
  "04n": brokenCloudsNight,
  "09d": showerRainDay,
  "09n": showerRainNight,
  "10d": rainDay,
  "10n": rainNight,
  "11d": thunderstormDay,
  "11n": thunderstormNight,
  "13d": snowDay,
  "13n": snowNight,
  "50d": mistDay,
  "50n": mistNight,
};

const forecastCardBackIcons = {
  sunrise: sunRise,
  sunset: sunSet,
  winddir: windDir,
  wind: wind,
};

export default { frog, elephant, weatherIcons, forecastCardBackIcons };
