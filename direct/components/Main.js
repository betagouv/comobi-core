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
				display: flex;
				justify-content: space-around;
				width: 100%;
				flex-wrap: wrap;
				height: 6rem;
				padding: 1rem 10vw;
				img {
					height: 100%;
					object-fit: contain;
				}
				border-bottom: 1px solid #4682b438;
			`}>
				<img src="${require('./images/logo_azur_comobi.jpg')}" alt="" />
				<img src="${require('./images/logo_greendeal_DPT_06.png')}" alt="" />
				<img src="${require('./images/logo_departement06.jpg')}" alt="" />
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
					p {

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
