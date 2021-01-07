import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js'
import styled from 'styled-components'
import Privacy from './Privacy'
import Inscription from './Inscription'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

const html = htm.bind(React.createElement)

let Main = function({
	tripProposalsByTrip,
	tripRequest,
	tripDetailsByTrip,
	validPlaceNames,
	onTripRequestChange
}) {
	return html`
		<${styled.main`
			height: 100%;
			display: flex;
			flex-direction: column;
		`}>
			<${styled.div`
				flex-grow: 1;
			`}>
			<${Router}>
			<${Switch}>
			<${Route} path="/recherche">
			<${TripSelection}
			...${{
				tripProposalsByTrip,
				tripRequest,
				tripDetailsByTrip,
				validPlaceNames,
				onTripRequestChange
			}}<//>
			<//>
			<//><//>

			</div>
		</main>
	`
}

let ExportedApp = Main

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Main)
}

export default ExportedApp
