import React, { useState, useEffect } from 'react'
import htm from 'htm'
import {
	ASYNC_STATUS,
	STATUS_PENDING,
	STATUS_ERROR,
	STATUS_VALUE
} from '../asyncStatusHelpers'
import { json } from 'd3-fetch'

const html = htm.bind(React.createElement)

const searchCity = (input, setOptions) =>
	json(
		`https://geo.api.gouv.fr/communes?nom=${input}&fields=nom,code,departement,region&boost=population`
	)
		.then(json => setOptions(json))
		.catch(function(error) {
			console.error(
				'Erreur dans la recherche de communes à partir du code postal',
				error
			)
			setOptions([])
		})

const CityInput = ({ label, input, setInput }) => {
	const [options, setOptions] = useState([])

	return html`
		<div>
			<label>
				<strong>${label}</strong>
				<input
					type="text"
					value=${input.text}
					onChange=${e => {
						const value = e.target.value
						setInput({ text: value, validated: false })
						if (value.length > 2) searchCity(e.target.value, setOptions)
						// Vérifier qu'aucune ville n'est exclue : https://fr.wikipedia.org/wiki/Liste_de_toponymes_courts
					}}
				/>
				${input.validated && '✔'}
			</label>
			${!input.validated &&
				html`
					<${Options} options=${options} onClick=${setInput} />
				`}
		</div>
	`
}
export default function TripRequestEntry({ tripRequest, onTripRequestChange }) {
	const [origin, setOrigin] = useState({ text: '', validated: false })
	const [destination, setDestination] = useState({ text: '', validated: false })

	useEffect(() => {
		origin.validated &&
			destination.validated &&
			onTripRequestChange({
				origin: origin.text,
				destination: destination.text
			})
	}, [origin, destination])

	let requestStatus = tripRequest[ASYNC_STATUS]

	return html`
		<h2 key="h2">Où allez-vous ?</h2>
		<form key="form" className="trip-request-entry">
			<section className="geography">
				<${CityInput} label="Départ" input=${origin} setInput=${setOrigin} />
				<${CityInput}
					label="Arrivée"
					input=${destination}
					setInput=${setDestination}
				/>
			</section>
		</form>
	`
}

const Options = ({ options, onClick }) =>
	html`
		<ul style=${{ width: '100%' }}>
			${options
				.map(
					({ nom, departement }) =>
						html`
							<li
								style=${{
									cursor: 'pointer'
								}}
								onClick=${() => onClick({ text: nom, validated: true })}
							>
								<span> ${nom}</span
								><span
									style=${{
										color:
											departement && departement.nom === 'Lot'
												? 'green'
												: 'grey'
									}}
									>${departement ? ' (' + departement.nom + ')' : ''}
								</span>
							</li>
						`
				)
				.slice(0, 5)}
		</ul>
	`

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
