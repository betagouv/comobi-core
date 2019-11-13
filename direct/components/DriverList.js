import React from 'react'
import htm from 'htm'
import styled from 'styled-components'
import TripProposal from './TripProposal'

const html = htm.bind(React.createElement)

export default function DriversList({
	tripProposalsByTrip,
	validTripRequest,
	tripDetailsByTrip,
	displayedDriverTrips,
	onTripClick
}) {
	const orderedTrips = [...tripProposalsByTrip.keys()].sort((trip1, trip2) => {
		const details1 = tripDetailsByTrip.get(trip1) || {
			originalDistance: 0,
			distanceWithDetour: Infinity
		}
		const details2 = tripDetailsByTrip.get(trip2) || {
			originalDistance: 0,
			distanceWithDetour: Infinity
		}

		const detour1 = details1.distanceWithDetour - details1.originalDistance
		const detour2 = details2.distanceWithDetour - details2.originalDistance

		return detour1 - detour2
	})

	if (!orderedTrips.length) return null
	if (!validTripRequest)
		return html`
			<div style=${{ textAlign: 'center', marginTop: '2rem' }}>
				<p style=${{ marginBottom: '0rem' }}>
					${orderedTrips.length} trajets disponibles sur Lotocar
				</p>
				<a href="http://bit.ly/inscription-conducteur"
					>J'ai une voiture et je veux aider</a
				>
			</div>
		`
	return html`
		<${styled.h2`
			margin-top: 1rem;
			text-align: center;
		`} key="h2">Conducteur.rice.s</h2>
		<${styled.ul`
			margin: 0 auto;
			max-width: 30rem;
			margin-bottom: 3rem;
		`} key="ul" className="drivers-list">
			${orderedTrips.slice(0, 10).map(trip => {
				const tripProposals = tripProposalsByTrip.get(trip)
				const tripDetails = tripDetailsByTrip.get(trip)

				return tripProposals.map((tripProposal, j) => {
					return html`
						<${TripProposal}
							key=${JSON.stringify(tripProposal)}
							tripProposal=${tripProposal}
							tripDetails=${tripDetails}
							isDisplayed=${displayedDriverTrips.has(trip)}
							onDriverClick=${() => onTripClick(trip)}
						/>
					`
				})
			})}
		</ul>
	`
}
