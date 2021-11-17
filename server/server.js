require('dotenv').config()
const cors = require('cors')
const express = require('express')
const axios = require('axios')
const path = require('path')


const app = express()

const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
    app.use(cors())
}
if (isProd) {
    app.get('/', (req,res) => {
        res.sendFile(path.join(__dirname,'..','dist','index.html'))
    })
    app.use('/assets', express.static(path.join(__dirname,'..','dist','assets')))
}
const WEATHER_API_BASE_URL = 'http://api.weatherapi.com/v1'

app.get('/health', (req, res) => {
    res.sendStatus(200)
})

app.get('/api/weather/forecast', async (req, res) => {
    const { data } = await axios.get(`${WEATHER_API_BASE_URL}/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${req.ip}`)
    try {
        res.send(data)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})


const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`server listening on port ${PORT}..`))

