import express from 'express'
import got from 'got'

import getDrivers from './spreadsheetDatabase/getDrivers.js'

const app = express()
const PORT = process.env.PORT || 39528

app.use(express.static('.'))

app.get('/', (req, res) => res.redirect('/Corresplot/'))

app.get('/drivers', (req, res) => {
    getDrivers().then(drivers => res.json(drivers))
})

app.get('/directions', (req, res) => {
    const googleAPIKey = process.env.GOOGLE_API_KEY
    const {origin, destination} = req.query;

    const googleDirectionsAPIURL = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving&units=metric&region=fr&key=${googleAPIKey}`

    got(googleDirectionsAPIURL)
    .then(({statusCode, body}) => res.status(statusCode).set('Content-Type', 'application/json').send(body) )
    .catch(({statusCode, body}) => {
        res.status(statusCode).send(body)
    })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))