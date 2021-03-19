import React from 'react'
import htm from 'htm'

//import TripRequestEntry from './TripRequestEntry.js'
import SearchComponent from './SearchComponent'
import DriverList from './DriverList.js'

import { ASYNC_STATUS } from '../asyncStatusHelpers'

const html = htm.bind(React.createElement)

export default function ({
	tripProposalsByTrip,
	tripRequest,
	validPlaceNames,
	positionByPlace,
	onTripRequestChange
}) {
	return html`
		<section className="trip-selection">
			<${SearchComponent}
				tripRequest=${tripRequest}
				validPlaceNames=${validPlaceNames}
				onTripRequestChange=${onTripRequestChange}
			/>
			<${DriverList}
				tripProposalsByTrip=${tripProposalsByTrip}
				tripRequestAsyncStatus=${tripRequest[ASYNC_STATUS]}
				validTripRequest=${tripRequest.destination !== '' &&
		tripRequest.origin !== ''}
				tripRequest=${tripRequest}
				positionByPlace=${positionByPlace}
			/>
		</section>
	`
}
