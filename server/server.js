require('dotenv').config()
const cors = require('cors')
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio');
const path = require('path');
// const pretty = require('pretty');


const app = express()

const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
    app.use(cors())
}
if (isProd) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
    })
    app.use('/assets', express.static(path.join(__dirname, '..', 'dist', 'assets')))
}
const WEATHER_API_BASE_URL = 'http://api.weatherapi.com/v1'

app.get('/health', (req, res) => {
    res.sendStatus(200)
})

// app.get('/background', async (req, res) => {

//     try {
//         const { data } = await axios.get("https://www.google.com/search?q=schaumburg&tbm=isch");
//         const $ =  cheerio.load(DataTransfer)
//         const image = $('img')
//         console.log(image)
//         // res.send($)
//     } catch (error) {
//         console.log(error)
//     }
// })
app.get('/forecast', async (req, res) => {
    const { data: weatherData } = await axios.get(`${WEATHER_API_BASE_URL}/forecast.json?key=${process.env.WEATHER_API_KEY}&q=98.228.23.0&days=14`);
    // const town = weatherData.location.name;
    const region = weatherData.location.tz_id.split('/')[1]
    console.log(region)
    // console.log(town)
    // const { data: image } = await axios.get(`https://www.google.com/search?q=${region}&tbm=isch&biw=1920&bih=1080`);
    const { data: image } = await axios.get(`https://unsplash.com/s/photos/${region}`);

    
    const $ = cheerio.load(image);
    // const imageSRC = $(".NZWO1b").find(".yWs4tf").attr("src");
    const imageSRC = $(".VQW0y").find(".YVj9w").attr("srcset");

    const body = [ weatherData, imageSRC ]

    try {
        res.send(body)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

app.use('/assets', express.static(path.join(__dirname, '..', 'dist', 'assets')))

const PORT = process.env.PORT || 4000
app.listen(PORT, console.log(`server listening on port ${PORT}..`))