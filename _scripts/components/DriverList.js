// @ts-check
import React from 'react'
import htm from 'htm'
import styled from 'styled-components'
import TripProposal from './TripProposal'
import findRelevantTripProposals  from '../../server/findRelevantTripProposals.js'
import config from '../../_config.yml'

const html = htm.bind(React.createElement)

// TODO : and other status ?
import {
	STATUS_PENDING,
	STATUS_ERROR,
	STATUS_VALUE
} from '../asyncStatusHelpers'

export default function DriversList({
	tripProposalsByTrip,
	tripRequestAsyncStatus,
	validTripRequest,
	tripRequest,
	positionByPlace
}) {
	let orderedTrips;
	if (!validTripRequest){
		return html`
			<div style=${{ textAlign: 'center', marginTop: '2rem' }}>
				<p style=${{ marginBottom: '0rem' }}>
					${tripProposalsByTrip.size} trajets disponibles sur ${config.nom}
				</p>
				<a href="${config.formulaire}"
					>J'ai une voiture et je veux aider</a
				>
			</div>
		`
	} else {
		orderedTrips = findRelevantTripProposals(tripRequest, tripProposalsByTrip, positionByPlace);
		const tripsByAdditionalTime = (request, key) =>
			displayTrips(
				key,
				tripProposalsByTrip,
				orderedTrips,
				tripRequest,
				([_, additionalTime]) => request(additionalTime)
			)

		const directTrips = tripsByAdditionalTime(time => time < 5, 1),
			trips10 = tripsByAdditionalTime(time => time >= 5 && time < 20, 2),
			trips20 = tripsByAdditionalTime(time => time >= 20 && time < 45, 3)
		
		const hasNoTrip = directTrips === undefined && trips10 === undefined && trips20 === undefined;
		
		return html`
			<${styled.div`
				h2,
				h3 {
					margin-top: 1rem;
					text-align: center;
				}
				ul {
					margin: 0 auto;
					max-width: 30rem;
					margin-bottom: 3rem;
				}

				> small {
					text-align: center;
					display: block;
					margin-bottom: 1.6rem;
				}

				em {
					background: yellow;
					font-style: normal;
				}
			`}>
				<h2 key="direct">${
					tripRequestAsyncStatus === STATUS_PENDING
						? `(recherche en cours)`
						: hasNoTrip
						? `(aucun résultat)`
						: `Trajets disponibles`
				}</h2>
				${directTrips}
				${(trips10 || trips20) &&
					html`
						<h3 key="indirect">Trajets indirects</h3>
					`}
				${trips10 &&
					html`
						<small key="10">
							Un <em>détour de plus de 5 minutes</em> sera nécessaire pour vousrécupérer :</small>
						${trips10}
					`}
				${trips20 &&
					html`
						<small key="20">
							Un <em>détour conséquent (entre 20 et 45 minutes)</em> sera nécessaire pour vous récupérer :</small>
						${trips20}
					`}
			</div>`
	}
}

/**
 * 
 * @param {*} key 
 * @param {*} tripProposalsByTrip 
 * @param {*} trips 
 * @param {*} tripRequest 
 * @param {*} filter 
 */
const displayTrips = (key, tripProposalsByTrip, trips, tripRequest, filter) => {
	let selectedTrips = trips
		.slice(0, 20)
		.filter(filter)
		.map(([trip], i) => {
			// get all tripProposal corresponding to the object trip {origin, destination}
			const tripProposals = tripProposalsByTrip.get(trip)
			return tripProposals.map(
				(tripProposal, j) => {
					const key = `${trip.origin}${i+j}`;
					return html`
					<${TripProposal}
						tripKey=${key}
						tripProposal=${tripProposal}
						tripRequest=${tripRequest}
					/>
				`
				})
			})
	return selectedTrips.length === 0 ? undefined :
		html`
			<ul key=${key} className="drivers-list">
				${selectedTrips}
			</ul>
		`
}
