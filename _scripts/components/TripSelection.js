import React from 'react'
import htm from 'htm'

import TripRequestEntry from './TripRequestEntry.js'
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
	// tripDetailsByTrip can be removed  
	return html`
		<section className="trip-selection">
			<${TripRequestEntry}
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
