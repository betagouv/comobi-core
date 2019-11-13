import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js'
import Map from './Map.js'

const html = htm.bind(React.createElement)

let Main = function({
	tripProposalsByTrip,
	directionsByTrip,
	tripRequest,
	tripDetailsByTrip,
	displayedDriverTrips,
	positionByPlace,
	onTripRequestChange,
	onTripClick
}) {
	return html`
		<main>
			<${Map}
				directionsByTrip=${directionsByTrip}
				tripRequest=${tripRequest}
				displayedDriverTrips=${displayedDriverTrips}
				positionByPlace=${positionByPlace}
			/>
			<${TripSelection}
				tripProposalsByTrip=${tripProposalsByTrip}
				tripRequest=${tripRequest}
				tripDetailsByTrip=${tripDetailsByTrip}
				displayedDriverTrips=${displayedDriverTrips}
				onTripRequestChange=${onTripRequestChange}
				onTripClick=${onTripClick}
			/>
		</main>
	`
}

let ExportedApp = Main

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Main)
}

export default ExportedApp
