import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js'
import logo from '../logo.png'
import logoLot from '../logo-lot.png'
import styled from 'styled-components'
import Privacy from './Privacy'

const html = htm.bind(React.createElement)

let Main = function ({
	tripProposalsByTrip,
	tripRequest,
	tripDetailsByTrip,
	validPlaceNames,
	onTripRequestChange,
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
				margin-top: 1rem;
			`}>
			<${TripSelection}
				tripProposalsByTrip=${tripProposalsByTrip}
				tripRequest=${tripRequest}
				tripDetailsByTrip=${tripDetailsByTrip}
				validPlaceNames=${validPlaceNames}
				onTripRequestChange=${onTripRequestChange}
			/></div>
			<${Footer} />
		</main>
	`
}

const Header = () => html`
			<${styled.header`
				display: flex;
				justify-content: center;
				width: 100%;
				margin-bottom: 2rem;
				img {
					margin: 1rem;
				}
				border-bottom: 1px solid #4682b438;
			`}>
				<img src=${logo} alt="Logo Lotocar" width="79px" height="79px" />
				<img src=${logoLot} alt="Logo préfecture du Lot" width="79px" height="79px" />
			</header>
`

const Footer = () => html`
			<footer>
				<${styled.section`
					background: #4682b4;
					color: white;
					padding: 0.3rem 1rem;
					a {
						color: inherit;
						text-decoration: underline;
					}
					text-align: center;
				`}>
					<div>
						Email : contact@lotocar.fr
					</div>
					<div>
						Tél : 05 31 60 09 03
					</div>
					<${Privacy}/>
					<div><a href="https://6b49e0e7-23a4-497b-931e-cb12669b2b05.filesusr.com/ugd/8db2ce_bfddb80831494ecc832301c3a4dc0105.pdf">Conditions générales d'utilisation</a></div>
				</section>
			</footer>

`
let ExportedApp = Main

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Main)
}

export default ExportedApp
