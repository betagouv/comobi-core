import express from 'express'
import got from 'got'

import memoize from 'fast-memoize';

import getDrivers from '../spreadsheetDatabase/getDrivers.js'
import getRequests from '../spreadsheetDatabase/getRequests.js'
import getLotocarPositionByPlace from '../spreadsheetDatabase/getLotocarPositionByPlace.js'
import positionByPlace from '../geography/positionByPlace.js';
import getPlacesPosition from '../server/getPlacesPosition.js';

const app = express()
const PORT = process.env.PORT || 39528

const memzGot = memoize(url => got(url))

app.use(express.static(__dirname))

app.get('/', (req, res) => res.redirect('/Corresplot/'))

app.get('/driver-trip-proposals', (req, res) => {
    getDrivers().then(drivers => res.json(drivers))
})

app.get('/positions', (req, res) => {
    /* In order to reduce the risk of max GET header size limit, 
        - p is a shorthand for places
        - we use the p=a&p=2 syntax instead of p[]=a&p[]=2, and treat the edge case of a single element array
    */ 
    const {p: placeOrPlaces} = req.query
    const places = Array.isArray(placeOrPlaces) ? placeOrPlaces : [placeOrPlaces]
    
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


app.get('/requests', (req, res) => {
    getRequests()
    .then(requests => res.json(requests))
    .catch(err => res.status(500).send(err))
})

app.listen(PORT, () => console.log(`L'application outil métier écoute sur le port ${PORT}!`))



// # Initialize data
const LOT_CODE = 46;
// ## First from all Lot communes
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
// ## Then from local knowledge
.then(() => {
    return getLotocarPositionByPlace()
    .then(lotocarPositionByPlace => {
        // this may override existing entries and that's on purpose
        for(const [name, position] of lotocarPositionByPlace){
            positionByPlace.set(name, position)
        }
    })
})
.catch(console.error)
