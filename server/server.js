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
const WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1";

app.post("/forecast", async (req, res) => {
  try {
    const { data: weatherData } = await axios.get(
      `${WEATHER_API_BASE_URL}/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${req.body.lat},${req.body.lon}&days=7`
    );
    const region = weatherData.location.tz_id.split("/")[1];
    if (!imageSrcCache[region]) {
      //......attempt to scrape image from photo website.....
      const { data: imagesHTML } = await axios.get(
        `https://unsplash.com/s/photos/${region}`
      );
      const $ = cheerio.load(imagesHTML);
      const imageSrcSet = $(".ripi6").find(".YVj9w").attr("srcset");

      if (imageSrcSet === undefined) {
        //.....if scarping fails for any reason send "defaults" to use in-app images....
        imageSrcCache[region] = "defaults";
      } else {
        //........caching images to avoid future scraping.....
        background = imageSrcSet.split(",")[16].split(" ")[1];
        imageSrcCache[region] = background;
      }
    }
    const body = { json: weatherData, background: imageSrcCache[region] };
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
