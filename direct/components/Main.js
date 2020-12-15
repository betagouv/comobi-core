import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js'
import styled from 'styled-components'
import Privacy from './Privacy'
import Inscription from './Inscription'
import Home from './Home'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
const instance = require(`../../instances/${INSTANCE}.yaml`)

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

			header,
			footer {
				flex-shrink: 0;
			}
		`}>
		<${Header} />
			<${styled.div`
				flex-grow: 1;
			`}>
			<${Router}>
			<${Switch}>
			<${Route} exact path="/">
				<${Home} />
			<//>
			<${Route} path="/inscription">
				<${Inscription} />
			<//>
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
			<${Footer} />
		</main>
	`
}

const Header = () => html`
	<${styled.header`
		display: block;
		width: 100%;
		img {
			max-width: 100%;
			object-fit: contain;

			min-height: 5vh;
			background-color: #b8e4e7;
		}
	`}>
		<img src="${require('./images/Bandeau azur comobi.png')}" alt="Bandeau azur.comobi.fr avec le logo comobi et les logos des collectivités qui financent" />
	</header>
`

const Footer = () => html`
	<footer>
		<${styled.section`
			background: #4682b4;
			color: white;
			padding: 0.3rem 1rem;
			text-align: center;
			a {
				color: inherit;
				text-decoration: underline;
			}
		`}>
			<div>
				Azur.CoMobi
			</div>
		</section>
		<${styled.section`
			background: #4682b4;
			color: white;
			padding: 0.3rem 1rem;
			text-align: center;
			a {
				color: inherit;
				text-decoration: underline;
			}
			p {
				margin: 0;
			}
		`}>
			<div>
				<p>Email : ${instance.contact.mel} </p>
				<p>Tél : ${instance.contact.tel} </p>
			</div>
		</section>
	</footer>
`
let ExportedApp = Main

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Main)
}

export default ExportedApp
