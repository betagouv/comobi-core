import React from 'react'
import htm from 'htm'
import classNames from 'classnames'
import styled from 'styled-components'

const KM = 1000 // meters
const AVERAGE_SPEED = 60 / 60 // km/min
const STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO = 1.4

const html = htm.bind(React.createElement)
export default function TripProposal({
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
		<${styled.li`
			padding: 0.5em;
			background: #8fc7ed33;
			margin: 1rem;
			border-radius: 1rem;
			box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
				0 1px 2px rgba(41, 117, 209, 0.24);
			> * {
				width: 100%;
			}
		`}
			className=${classNames('driver', { displayed: isDisplayed })}
			onClick=${onDriverClick}
		>
        <${styled.div`
					display: flex;
					align-items: center;
					justify-content: space-evenly;
					> section {
						margin-left: 0.6rem;
						max-width: 55%;
					}
				`}>
		<${Detour} ...${{ detourClassName, tripDetails, additionalTime }} />
			<section>
				<span className="name">${Prénom} ${Nom}</span>
				<span className="proposed-trip">
					${Départ} - ${Arrivée}
					${Jours &&
						html`
							<div className="datetime">🗓️ ${Jours}</div>
						`}				
						${heureDépart !== '-' &&
							html`
								<div className="datetime">⌚ à ${heureDépart}</div>
							`}
				</span>
			</section>
            </div>
				<${StandardContact} />
		</li>
	`
}

const StandardContact = ({}) => {
	const tel = '0531600903'
	return html`
		<${styled.a`
			background: rgba(147, 196, 125, 1);
			padding: 0.1rem 0.4rem;
			border-radius: 0.3rem;
			color: white;
			width: 14rem;
			margin: 0.4rem auto 0.2rem;
			display: block;
			text-align: center;
		`} href="tel:${tel}">Lotocar (${tel})</a>
	`
}

const Detour = ({ detourClassName, tripDetails, additionalTime }) =>
	html`
		<section className="${detourClassName} trip-details">
			${additionalTime === 0
				? html`
						<span>Pas de détour</span>
				  `
				: html`
						<span>
							${tripDetails && 'détour'}
							<br />${tripDetails
								? `${Math.ceil(additionalTime)}mins`
								: undefined}
						</span>
				  `}
		</section>
	`
