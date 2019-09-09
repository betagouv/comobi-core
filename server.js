import express from 'express'
import got from 'got'

import memoize from 'fast-memoize';

import getDrivers from './spreadsheetDatabase/getDrivers.js'
import positionByPlace from './Corresplot/geography/positionByPlace.js';
import getPlacesPosition from './server/getPlacesPosition.js';

const app = express()
const PORT = process.env.PORT || 39528

const memzGot = memoize(url => got(url))

app.use(express.static('.'))

app.get('/', (req, res) => res.redirect('/Corresplot/'))

app.get('/drivers', (req, res) => {
    getDrivers().then(drivers => res.json(drivers))
})

app.get('/positions', (req, res) => {
    const {places} = req.query;

    const result = Object.create(null)

    const placesWithoutPositions = new Set(places);

    // get known places from positionByPlace
    for(const place of placesWithoutPositions){
        const position = positionByPlace.get(place)
        if(position){
            result[place] = position
            placesWithoutPositions.delete(place)
        }
    }

    if(placesWithoutPositions.size === 0){
        res.json(result)
        return
    }
    else{ // if there are missing positions, ask the Geo API
        getPlacesPosition(placesWithoutPositions)
        .then(placeToPositionMap => {
            for(const [place, position] of placeToPositionMap){
                result[place] = position
            }
            res.json(result)
        })
        .catch(err => res.status(500).send(err))
    }
})

app.get('/directions', (req, res) => {
    const googleAPIKey = process.env.GOOGLE_API_KEY
    const {origin, destination} = req.query;

    const googleDirectionsAPIURL = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving&units=metric&region=fr&key=${googleAPIKey}`

    memzGot(googleDirectionsAPIURL)
    .then(({statusCode, body}) => res.status(statusCode).set('Content-Type', 'application/json').send(body) )
    .catch(({statusCode, body}) => {
        res.status(statusCode).send(body)
    })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

// initialize data
const LOT_CODE = 46;
got(`https://geo.api.gouv.fr/departements/${LOT_CODE}/communes?format=geojson`, {json: true})
.then(({body: lotGeojson}) => {
    const communes = lotGeojson.features;

    for(const commune of communes){
        const name = commune.properties.nom
        // > GeoJSON describes an order for coordinates: they should go, in order:
        // > [longitude, latitude, elevation]
        // > This order can be surprising. Historically, the order of coordinates is usually “latitude, longitude”
        // https://macwright.org/2015/03/23/geojson-second-bite#position
        const [longitude, latitude] = commune.geometry.coordinates

        positionByPlace.set(name, {latitude, longitude})
    }
})
.then(() => {
    throw `TODO initialize positionByPlace with driver list`
})
.catch(console.error)
