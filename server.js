import express from 'express'
import cors from 'cors'


import getLotocarPositionByPlace from './spreadsheetDatabase/getLotocarPositionByPlace.js'
import positionByPlace from './geography/positionByPlace.js'
import getPlacesPosition from './server/getPlacesPosition.js'

import driverTripProposalsRoute, {
	PASSAGER_CONTACT_DIRECT_ACCEPT
} from './server/driverTripProposalsRoute.js'

const app = express()
const PORT = process.env.PORT || 39528
const devMode = process.env.NODE_ENV === 'development'
app.use(cors())


const lotocarPositionByPlaceP = getLotocarPositionByPlace()

const validPlaceNamesP = lotocarPositionByPlaceP
	.then(lotocarPositionByPlace => {
		const placeNames = new Set()

		for (const [name, position] of lotocarPositionByPlace) {
			placeNames.add(name)
		}

		return [...placeNames]
	})

/*if (devMode) {
	app.use(
		middleware(compiler, {
			hot: true,
			publicPath: '/build/'
			// webpack-dev-middleware options
		})
	)
}*/

app.use(express.static(__dirname))

//app.get('/', (req, res) => res.redirect('/Corresplot/'))

function makeDriverObject(driverTripProposal) {
	const {
		Prénom,
		Nom,
		'Contact direct passager': directContact,
		'N° de téléphone': phone,
		Employeur
	} = driverTripProposal

	return {
		Prénom,
		Nom: Nom && Nom[0].toUpperCase() + '.',
		phone: directContact === PASSAGER_CONTACT_DIRECT_ACCEPT ? phone : undefined,
		Employeur
	}
}

app.get('/driver-trip-proposals', driverTripProposalsRoute(makeDriverObject))

app.get('/positions', (req, res) => {
	//In order to reduce the risk of max GET header size limit, 
       // - p is a shorthand for places
       // - we use the p=a&p=2 syntax instead of p[]=a&p[]=2, and treat the edge case of a single element array
  

	const { p: placeOrPlaces } = req.query
	const places = Array.isArray(placeOrPlaces) ? placeOrPlaces : [placeOrPlaces]

	const result = Object.create(null)

	const placesWithoutPositions = new Set(places)

	// get known places from positionByPlace
	for (const place of placesWithoutPositions) {
		const position = positionByPlace.get(place)
		if (position) {
			result[place] = position
			placesWithoutPositions.delete(place)
		}
	}

	if (placesWithoutPositions.size === 0) {
		res.json(result)
		return
	} else {
		// if there are missing positions, ask the Geo API
		getPlacesPosition(placesWithoutPositions)
			.then(placeToPositionMap => {
				for (const [place, position] of placeToPositionMap) {
					result[place] = position
				}
				res.json(result)
			})
			.catch(err => res.status(500).send(err))
	}
})

app.get('/valid-place-names', (req, res) => {
	validPlaceNamesP
		.then(validPlaceNames => res.json(validPlaceNames))
		.catch(err => res.status(500).send(err))
})

app.get('/', function(req, res) {
	res.sendFile('index.html', {
		root: __dirname
	})
})

app.get('/recherche', function(req, res) {
	res.sendFile('recherche.html', {
		root: __dirname
	})
})

app.get('/*', function(req, res) {
	res.sendFile('404.html', {
		root: __dirname
	})
})

// NOT USED
/*
app.post('/inscription', function(req, res) {
	// Update spreadsheet with this API (batchUpdate or append) : https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate
	res.send({ ok: true })
})*/

// if (devMode) app.use(require('webpack-hot-middleware')(compiler))

app.listen(PORT, () =>
	console.log(`L'application directe écoute sur le port ${PORT}!`)
)

// # Initialize data
lotocarPositionByPlaceP.then(lotocarPositionByPlace => {
	// this may override existing entries and that's on purpose
	for (const [name, position] of lotocarPositionByPlace) {
		positionByPlace.set(name, position)
	}
})
.catch(console.error)
