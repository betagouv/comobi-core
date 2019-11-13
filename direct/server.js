import express from 'express'
import got from 'got'

import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import config from './webpack.config.js'
const compiler = webpack(config)

import memoize from 'fast-memoize'

import getDrivers from '../spreadsheetDatabase/getDrivers.js'
import getLotocarPositionByPlace from '../spreadsheetDatabase/getLotocarPositionByPlace.js'
import positionByPlace from '../geography/positionByPlace.js'
import getPlacesPosition from '../server/getPlacesPosition.js'

const app = express()
const PORT = process.env.PORT || 39528
const devMode = process.env.NODE_ENV === 'development'

if (devMode) {
	app.use(
		middleware(compiler, {
			hot: true,
			publicPath: '/build/'
			// webpack-dev-middleware options
		})
	)
}

app.use(express.static(__dirname))

app.get('/', (req, res) => res.redirect('/Corresplot/'))

app.get('/driver-trip-proposals', (req, res) => {
	getDrivers()
		.then(function cleanupDriverTripProposals(driverTripProposals) {
			for (const driverTripProposal of driverTripProposals) {
				driverTripProposal['Départ'] = driverTripProposal['Départ'].trim()
				driverTripProposal['Arrivée'] = driverTripProposal['Arrivée'].trim()
			}
			return driverTripProposals
		})
		.then(function driverTripProposalsToTripProposals(driverTripProposals) {
			const tripProposals = []

			for (const driverTripProposal of driverTripProposals) {
				const {
					Départ,
					Arrivée,
					Trajet,
					Jours,
					'Heure départ': HeureDépart,
					'Heure retour': HeureRetour,
					Adresse,
					Prénom,
					Nom,
					'N° de téléphone': tel,
					'Adresse e-mail': email,
					'Contact préféré': favContact
				} = driverTripProposal

				const driver = Object.freeze({
					Prénom,
					Nom: Nom && Nom[0].toUpperCase() + '.'
				})

				tripProposals.push({
					Départ,
					Arrivée,
					Trajet,
					Jours,
					'Heure départ': HeureDépart,
					driver
				})

				if (HeureRetour) {
					tripProposals.push({
						Départ: Arrivée,
						Arrivée: Départ,
						Trajet: undefined, // should be the reverse Trajet. Will this ever matter?
						Jours,
						'Heure départ': HeureRetour,
						driver
					})
				}
			}

			res.json(tripProposals)
		})
})

app.get('/positions', (req, res) => {
	/* In order to reduce the risk of max GET header size limit, 
        - p is a shorthand for places
        - we use the p=a&p=2 syntax instead of p[]=a&p[]=2, and treat the edge case of a single element array
    */

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

if (devMode) app.use(require('webpack-hot-middleware')(compiler))

app.listen(PORT, () =>
	console.log(`L'application directe écoute sur le port ${PORT}!`)
)

// # Initialize data
const LOT_CODE = 46
// ## First from all Lot communes
got(
	`https://geo.api.gouv.fr/departements/${LOT_CODE}/communes?format=geojson`,
	{ json: true }
)
	.then(({ body: lotGeojson }) => {
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
		return getLotocarPositionByPlace().then(lotocarPositionByPlace => {
			// this may override existing entries and that's on purpose
			for (const [name, position] of lotocarPositionByPlace) {
				positionByPlace.set(name, position)
			}
		})
	})
	.catch(console.error)
