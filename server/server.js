require("dotenv").config();
const cors = require("cors");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const bodyparser = require("body-parser");

const app = express();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function randomQuoteInt() {
  const quoteNumber = getRandomInt(0, 24)
  // console.log(quoteNumber, 'quote')
  return quoteNumber
}

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

const imageSearch = [
  "mountains",
  "icebergs",
  "iceland",
  "zen",
  "northern lights",
];
let background;

const cache = {
  weather: {},
  background: {},
  quote: {},
};

async function checkCache(
  backgroundImage,
  city,
  randQuote,
  lat,
  lon,
  key,
  body
) {
  if (!cache.background[backgroundImage]) {
    //......attempt to scrape image from photo website.....
    const { data: imagesHTML } = await axios.get(
      `https://unsplash.com/s/photos/${backgroundImage}`
    );
    const $ = cheerio.load(imagesHTML);
    const imageSrcSet = $(".ripi6").children().find(".YVj9w")[
      getRandomInt(12, 25)
    ].attribs.srcset;
    if (imageSrcSet === undefined) {
      //.....if scarping fails for any reason send "defaults" to use in-app images....
      cache.background[backgroundImage] = "defaults";
    } else {
      //........caching images to avoid future scraping.....
      background = imageSrcSet.split(",")[16].split(" ")[1];
      cache.background[backgroundImage] = background;
      body["background"] = cache.background[backgroundImage];
    }
  } else {
    console.log("using cache for image");
  }

  if (!cache.quote[randQuote]) {
    // ....get html data to scrape quote from web...
    const { data: quoteHTML } = await axios.get(
      "https://www.brainyquote.com/profession/quotes-by-philosophers"
    );
    const $ = cheerio.load(quoteHTML)
    $("#qbc1 div.clearfix").each((i,e) => {
      const quote = $(e).find("div").text()
      const author = $(e).find("a.bq-aut").text()
      cache.quote[i] = [quote, author]
      body["quote"] = cache.quote[getRandomInt(0,59)]
    })
    console.log(body)

  } else {
    console.log("using cache for quote");
  }

  if (!cache.weather[city]) {
    //....cache weather data based on city name, cache resets every 15 minutes
    const { data: weatherData } = await axios.get(
      `${WEATHER_API_BASE_URL}data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&exclude=minutely,hourly,alerts&units=imperial`
    );
    cache.weather[city] = weatherData;
    body["json"] = cache.weather[city];
  } else {
    console.log("using cache for weather");
  }
  // console.log(cache);
}

const WEATHER_API_BASE_URL = "http://api.openweathermap.org/";

app.post("/forecast", async (req, res) => {
  try {
    console.log(req.body);
    const lat = req.body.lat;
    const lon = req.body.lon;
    const key = process.env.WEATHER_API_KEY3;
    //.....get user city name....
    const location = await axios.get(
      `${WEATHER_API_BASE_URL}geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${key}`
    );
    //.....get user city weather.....
    const city = location.data[0].name;
    let backgroundImage = imageSearch[getRandomInt(0, 5)];
    
    let randQuote = randomQuoteInt();
    let body = {
      city: city,
      json: cache.weather[city],
      background: cache.background[backgroundImage],
      quote: cache.quote[randQuote]
    };
    await checkCache(backgroundImage, city, randQuote, lat, lon, key, body);

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
