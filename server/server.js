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
// if (isProd) {
//   app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
//   });
//   app.use(
//     "/assets",
//     express.static(path.join(__dirname, "..", "dist", "assets"))
//   );
// }
app.enable("trust proxy");
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.use(
  "/assets",
  express.static(path.join(__dirname, "..", "dist", "assets"))
);
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1";

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

let location;

app.post("/location", (req, res) => {
  console.log(req.body);
  location = req.body;
});

const imageSrcCache = {};
let background;

app.get("/forecast", async (req, res) => {
  // let IP;
  // isProd ? (IP = req.ip) : (IP = "auto:ip");
  try {
    const { data: weatherData } = await axios.get(
      `${WEATHER_API_BASE_URL}/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location.lat},${location.lon}&days=7`
    );
    const region = weatherData.location.tz_id.split("/")[1];
    if (!imageSrcCache[region]) {
      const { data: imagesHTML } = await axios.get(
        `https://unsplash.com/s/photos/${region}`
      );
      const $ = cheerio.load(imagesHTML);
      const imageSrcSet = $(".ripi6").find(".YVj9w").attr("srcset");
      if (imageSrcSet === undefined) {
        imageSrcCache[region] = "defaults";
      } else {
        background = imageSrcSet.split(",")[16].split(" ")[1];
        imageSrcCache[region] = background;
      }
    }
    const body = { json: weatherData, background: imageSrcCache[region] };
    // console.log(imageSrcCache);
    // console.log(body)
    res.send(body);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`server listening on port ${PORT}..`));
