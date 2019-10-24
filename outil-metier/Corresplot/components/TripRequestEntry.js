import React, { useState, useEffect } from 'react'
import htm from 'htm'
import {
	ASYNC_STATUS,
	STATUS_PENDING,
	STATUS_ERROR,
	STATUS_VALUE
} from '../asyncStatusHelpers'

const html = htm.bind(React.createElement)

export default function TripRequestEntry({ tripRequest, onTripRequestChange }) {
	const [origin, setOrigin] = useState(tripRequest.origin)
	const [destination, setDestination] = useState(tripRequest.destination)

	// pass new trip to state if it came from props
	useEffect(() => {
		setOrigin(tripRequest.origin)
	}, [tripRequest.origin])
	useEffect(() => {
		setDestination(tripRequest.destination)
	}, [tripRequest.destination])

	function onSubmit(e) {
		e.preventDefault()
		onTripRequestChange({
			origin,
			destination
		})
	}
	let requestStatus = tripRequest[ASYNC_STATUS]

	return html`
		<h2 key="h2">Demande de trajet</h2>
		<form key="form" className="trip-request-entry" onSubmit=${onSubmit}>
			<section className="geography">
				<label>
					<strong>Départ</strong>
					<input
						className="origin"
						type="text"
						value=${origin}
						onChange=${e => setOrigin(e.target.value)}
					/>
				</label>
				<label>
					<strong>Arrivée</strong>
					<input
						className="destination"
						type="text"
						value=${destination}
						onChange=${e => setDestination(e.target.value)}
					/>
				</label>
			</section>

			<button type="submit">Ok</button>
			${requestStatus !== STATUS_VALUE &&
				html`
					<${RequestStatus} status=${requestStatus} />
				`}
		</form>
	`
}

const RequestStatus = ({ status }) => html`
	<div className="status">
		${status === STATUS_PENDING
			? 'Recherche en cours...'
			: status === STATUS_ERROR
			? html`
					<div
						style=${{
							background: '#ffd8d8',
							padding: '.4rem 1rem',
							borderRadius: '1rem',
							margin: '.6rem'
						}}
					>
						Erreur lors de votre recherche. <br />Êtes-vous sûr que ces villes
						existent ?
					</div>
			  `
			: undefined}
	</div>
`
