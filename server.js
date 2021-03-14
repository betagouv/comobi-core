import * as path from 'path'
import express from 'express'
import cors from 'cors'
import got from 'got'
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import getLotocarPositionByPlace from './spreadsheetDatabase/getLotocarPositionByPlace.js'
import positionByPlace from './geography/positionByPlace.js'
import getPlacesPosition from './server/getPlacesPosition.js'

import yaml from 'js-yaml';
import fs from 'fs';

import driverTripProposalsRoute, {
	PASSAGER_CONTACT_DIRECT_ACCEPT
} from './server/driverTripProposalsRoute.js'

const app = express()
const PORT = process.env.PORT || 39528
const devMode = process.env.NODE_ENV === 'development'
app.use(cors())

// Get document, or throw exception on error
let CONFIG = {}
try {
  CONFIG = yaml.load(fs.readFileSync('_config.yml', 'utf8'));
} catch (e) {
  console.log(e);
}

const LOT_CODE = process.env.CODE_DEPARTEMENT || '34'
// get all cities for the herault depatment
const lotGeojsonP = got(
	`https://geo.api.gouv.fr/departements/${LOT_CODE}/communes?format=geojson`,
	{ json: true }
).then(({ body }) => body)

const lotocarPositionByPlaceP = getLotocarPositionByPlace()

const getPlaceNameList = (positionByPlace) => {
	const placeNames = new Set()
	for (const [name, position] of positionByPlace) {
		placeNames.add(name)
	}
	return placeNames
}
const validPlaceNamesP = CONFIG.liste_ville_restreinte !== undefined && CONFIG.liste_ville_restreinte.toLowerCase() === "oui" ? 
	lotocarPositionByPlaceP.then(positionByPlace => [...getPlaceNameList(positionByPlace)])
	: Promise.all([
		lotGeojsonP,
		lotocarPositionByPlaceP
	])
		.then(([lotGeojson, positionByPlace]) => {
			const placeNames = getPlaceNameList(positionByPlace);

			const communes = lotGeojson.features
			for (const commune of communes) {
				const placeName = commune.properties.nom
				placeNames.add(placeName)
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
		'Adresse e-mail': email,
		'Consentement': consentement,
		'N° de téléphone': phone,
		'Lieu précis': lieu,
		'Contact préféré': modeContact
	} = driverTripProposal

	return {
		Prénom,
		Nom: Nom && Nom[0].toUpperCase() + '.',
		modeContact,
		contact: consentement === PASSAGER_CONTACT_DIRECT_ACCEPT ? (modeContact === 'Email' ? email : phone) : undefined, 
		lieu
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

if (CONFIG.lien_cgu !== undefined && CONFIG.lien_cgu === "/cgu") {
	// On s'attend à ce que la page soit sur le site
	app.get('/cgu', function(req, res) {
		res.sendFile('cgu.html', {
			root: __dirname
		})
	})
}

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
lotGeojsonP
	.then(lotGeojson => {
		const communes = lotGeojson.features

		for (const commune of communes) {
			const name = commune.properties.nom
			// > GeoJSON describes an order for coordinates: they should go, in order:
			// > [longitude, latitude, elevation]
			// > This order can be surprising. Historically, the order of coordinates is usually “latitude, longitude”
			// https://macwright.org/2015/03/23/geojson-second-bite#position
			const [longitude, latitude] = commune.geometry.coordinates

			positionByPlace.set(name, { latitude, longitude })
		}
	})
	// ## Then from local knowledge
	.then(() => {
		return lotocarPositionByPlaceP.then(lotocarPositionByPlace => {
			// this may override existing entries and that's on purpose
			for (const [name, position] of lotocarPositionByPlace) {
				positionByPlace.set(name, position)
			}
		})
	})
	.catch(console.error)

/*lotocarPositionByPlaceP.then(lotocarPositionByPlace => {
	// this may override existing entries and that's on purpose
	for (const [name, position] of lotocarPositionByPlace) {
		positionByPlace.set(name, position)
	}
})
.catch(console.error)*/
