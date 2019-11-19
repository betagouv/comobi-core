import React, { useState } from 'react'
import htm from 'htm'
import classNames from 'classnames'
import styled from 'styled-components'
import { SimpleButton, ContactLinkButton } from './ButtonStyle'

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
	const [selected, setSelected] = useState(false)
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
		${
			selected
				? html`
						<div>
							<${FormContact}
								from=${Départ}
								to=${Arrivée}
								moreInfo=${`Conducteur sélectionné: ${Prénom} ${Nom}`}
							/>
							<${TelephoneContact} />
							<${SimpleButton} onClick=${() => setSelected(false)}>Retour</button>
						</div>
				  `
				: html`
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
			<${ContactLinkButton} onClick=${() =>
						setSelected(true)}>Faire une demande</${ContactLinkButton}>`
		}
		</li>
	`
}

const TelephoneContact = ({}) => {
	const tel = '0531600903'
	return html`
		<${ContactLinkButton} href="tel:${tel}"
			>Lotocar (${tel}) 
		</${ContactLinkButton}>
	`
}
const FormContact = ({ from, to, moreInfo }) => {
	return html`
		<${ContactLinkButton} 
		target="_blank"
		href=${`https://docs.google.com/forms/d/e/1FAIpQLSf-bhTbcJ36S7PQK167zxaEkvaMSBzg8yOwQx0fDUQMd4_pYQ/viewform?entry.227174060=${from}&entry.44825971=${to}&entry.1204459643=${moreInfo}`}>
		📄 Demande en ligne
		</${ContactLinkButton}>
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
