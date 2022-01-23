require("dotenv").config();
const cors = require("cors");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const bodyparser = require("body-parser");

const app = express();

const isProd = process.env.NODE_ENV === "production";
if (!isProd) {
  app.use(cors());
}

app.enable("trust proxy");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(
  "/assets",
  express.static(path.join(__dirname, "..", "dist", "assets"))
);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

let background;
const imageSrcCache = {};
// const WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1";
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

app.post("/forecast", async (req, res) => {
  try {
    console.log(req.body);
    const lat = req.body.lat;
    const lon = req.body.lon;
    const key = process.env.WEATHER_API_KEY3;
    const location = await axios.get(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${key}`
    );
    const { data: weatherData } = await axios.get(
      // `${WEATHER_API_BASE_URL}/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}&days=7`
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&exclude=minutely,hourly,alerts&units=imperial`
    );
    console.log(weatherData);
    // const weatherDescription = weatherData.timezone.split("/")[1];
    const weatherDescription = weatherData.current.weather[0].main;
    // const weatherDescription = "zen";
    console.log(weatherDescription);
    if (!imageSrcCache[weatherDescription]) {
      //......attempt to scrape image from photo website.....
      const { data: imagesHTML } = await axios.get(
        `https://unsplash.com/s/photos/${weatherDescription}`
      );
      const $ = cheerio.load(imagesHTML);
      const imageSrcSet = $(".ripi6").find(".YVj9w").attr("srcset");

      if (imageSrcSet === undefined) {
        //.....if scarping fails for any reason send "defaults" to use in-app images....
        imageSrcCache[weatherDescription] = "defaults";
      } else {
        //........caching images to avoid future scraping.....
        background = imageSrcSet.split(",")[16].split(" ")[1];
        imageSrcCache[weatherDescription] = background;
      }
    }
    const body = {
      city: location.data[0].name,
      json: weatherData,
      background: imageSrcCache[weatherDescription],
    };
    // console.log(location.data[0].name);

    res.send(body);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`server listening on port ${PORT}..`));
