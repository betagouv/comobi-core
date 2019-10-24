import React from 'react'
import htm from 'htm'
import classNames from 'classnames'

const html = htm.bind(React.createElement)

const KM = 1000 // meters
const AVERAGE_SPEED = 60 / 60 // km/min
const STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO = 1.4

function TripProposal({
	tripProposal,
	tripDetails,
	isDisplayed,
	onDriverClick
}) {
	const {
		Départ,
		Arrivée,
		Jours,
		'Heure départ': heureDépart,
		driver: { Prénom, Nom, 'N° de téléphone': phone, 'Adresse e-mail': email }
	} = tripProposal

	const phoneLink = phone ? `tel:${phone.trim()}` : undefined
	const emailLink =
		email && email.includes('@') ? `mailto:${email.trim()}` : undefined

	let originalDistance,
		distanceWithDetour,
		detourClassName,
		additionalDistanceKM

	if (tripDetails) {
		originalDistance = tripDetails.originalDistance
		distanceWithDetour = tripDetails.distanceWithDetour

		additionalDistanceKM =
			((distanceWithDetour - originalDistance) *
				STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO) /
			KM

		detourClassName =
			additionalDistanceKM <= 5 * AVERAGE_SPEED
				? 'minor-detour'
				: additionalDistanceKM <= 15 * AVERAGE_SPEED
				? 'medium-detour'
				: 'major-detour'
	}

	// in minutes, assuming average 60km/h
	const additionalTime = additionalDistanceKM * AVERAGE_SPEED

	return html`
		<li
			className=${classNames('driver', { displayed: isDisplayed })}
			onClick=${onDriverClick}
		>
			<section className="${detourClassName} trip-details">
				<span
					>${tripDetails
						? `+${Math.ceil(additionalTime)}mins`
						: undefined}</span
				>
			</section>
			<section>
				<span className="name">${Prénom} ${Nom}</span>
				<span className="proposed-trip">
					${Départ} - ${Arrivée} -
					<span className="datetime">${Jours} - Heure: ${heureDépart}</span>
				</span>
				<span className="contact">
					<a href="${phoneLink}"
						>${phone ? phone.trim() : `(pas de téléphone)`}</a
					>
					<a href="${emailLink}"
						>${email && email.includes('@') ? `email` : `(pas d'email)`}</a
					>
				</span>
			</section>
		</li>
	`
}

export default function DriversList({
	tripProposalsByTrip,
	tripRequest,
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

	return html`
		<h2 key="h2">Conducteur.rice.s</h2>
		<ul key="ul" className="drivers-list">
			${orderedTrips.map(trip => {
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
