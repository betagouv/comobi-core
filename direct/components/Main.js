import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js'
import logo from '../logo.png'
import logoLot from '../logo-lot.png'
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
				margin-top: 1rem;
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
				display: flex;
				justify-content: center;
				width: 100%;
				margin-bottom: 2rem;
				img {
					margin: 1rem;
					width: 8rem;
				}
				border-bottom: 1px solid #4682b438;
			`}>
			${
				instance.logo
					? html`
							<img src=${instance.logo} alt="Logo" width="79px" height="79px" />
							<img
								class="navbar__logo"
								src="
							          
					            https://d33wubrfki0l68.cloudfront.net/cbc2e53520301452a60252cbbd165df72df793f1/7c86f/assets/images/logo-marianne.svg
					          
					          "
								alt="beta.gouv.fr"
							/>
							<img
								src="https://d33wubrfki0l68.cloudfront.net/8a59b7696f7c0a39fa0904ddac1769a772e249e5/a88f5/assets/additional/images/logo-betagouvfr.svg"
								class="navbar__gouvfr"
								alt="gouv.fr"
							/>
					  `
					: html`
							<img src=${logo} alt="Logo Lotocar" width="79px" height="79px" />
							<img
								src=${logoLot}
								alt="Logo préfecture du Lot"
								width="79px"
								height="79px"
							/>
					  `
			}
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
						Email : ${instance.contact.mel}
					</div>
					<div>
						Tél : ${instance.contact.téléphone}
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
