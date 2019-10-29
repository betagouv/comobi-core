import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js'

const html = htm.bind(React.createElement)

export default function({
	tripProposalsByTrip,
	tripRequest,
	tripDetailsByTrip,
	displayedDriverTrips,
	positionByPlace,
	onTripRequestChange,
	onTripClick
}) {
	return html`
		<main>
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
