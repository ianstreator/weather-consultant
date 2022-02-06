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
// const quoteCache = {};
const imageSearch = ["mountains", "icebergs", "iceland", "leaves", "zen", "northern lights"];
const WEATHER_API_BASE_URL = "http://api.openweathermap.org/";
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
      `${WEATHER_API_BASE_URL}geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${key}`
    );
    const { data: weatherData } = await axios.get(
      `${WEATHER_API_BASE_URL}data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&exclude=minutely,hourly,alerts&units=imperial`
    );
    // console.log(weatherData);
    let weatherDescription = imageSearch[getRandomInt(0, 6)];
    // console.log(weatherDescription);
    // console.log(imageSrcCache);
    // const quote = await axios.get(
    //   "https://www.brainyquote.com/profession/quotes-by-philosophers"
    // );
    // console.log(quote)
    // const $ = cheerio.load(quote);
    // console.log($)
    // const selectedQuote = $(".qbc2").children().length;
    // console.log(selectedQuote, 'hello');
    if (!imageSrcCache[weatherDescription]) {
      //......attempt to scrape image from photo website.....
      const { data: imagesHTML } = await axios.get(
        `https://unsplash.com/s/photos/${weatherDescription}`
      );
      const $ = cheerio.load(imagesHTML);
      const imageSrcLength = $(".ripi6").children().find(".YVj9w").length;
      console.log(imageSrcLength)
      const imageSrcSet = $(".ripi6").children().find(".YVj9w")[
        getRandomInt(12, 25)
      ].attribs.srcset;
      // console.log(imageSrcSet)
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
