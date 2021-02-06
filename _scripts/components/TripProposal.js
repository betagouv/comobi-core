import React, { useState } from 'react'
import htm from 'htm'
import classNames from 'classnames'
import styled from 'styled-components'
import {
	SimpleButton,
	ContactLinkButton as ContactButtonStyle
} from './ButtonStyle'
const html = htm.bind(React.createElement)
const config = require(`../../_config.yml`)

export default function TripProposal({
	tripKey,
	tripProposal,
	tripRequest
}) {
	const [selected, setSelected] = useState(false)
	const {
		Départ,
		Arrivée,
		Jours,
		Jour,
		'Heure départ': heureDépart,
		driver: { Prénom, Nom, contact, lieu, modeContact }
	} = tripProposal
	return html`
		<${styled.li`
			padding: 0.5em;
			background: #8fc7ed33;
			margin: 1rem;
			border-radius: 1rem;
			box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
				0 1px 2px rgba(41, 117, 209, 0.24);
		`}
			className=${classNames('driver')}
			key=${tripKey}
		>
		${html`
        <${styled.div`
					margin: 0.3rem 1rem;
					.quand {
						display: flex;
						align-items: center;
						width: 80%;
						margin: 0.3rem 0;
					}
					.quand > span {
						margin-right: 0.6rem;
					}
					small {
						display: block;
					}
				`} key=${tripKey} >
				<div className="proposed-trip">
					<strong>🚙 ${Départ} - ${Arrivée}</strong>
					${lieu &&
						html`
							<small>📌 ${lieu}</small>
						`}
						${html`
							<div className="quand">
								<span>🗓️</span
								><span>
									${(Jours !== '') ? 
									html`<span className="datetime">${Jours}</span>` : 
									(Jour !== '') && html`<span className="datetime">Le ${Jour}</span>`
									}
									${heureDépart !== '-' &&
										html`
											<span className="datetime"> à ${heureDépart}</span>
										`}
								</span>
							</div>
						`}
				</div>
				<div>👱 ${Prénom} ${Nom}</div>
			</div>`}
			${
				selected
					? html`
						<div>
						${!contact &&
							html`
								<${FormContact}
									from=${tripRequest.origin}
									to=${tripRequest.destination}
									moreInfo=${`
									Conducteur sélectionné: ${Prénom} ${Nom}, de ${Départ} à ${Arrivée}.
								`}
								/>
							`}
						<${DriverContact} modeContact=${modeContact} contact=${contact} />
						<${SimpleButton} onClick=${() => setSelected(false)}>Retour</button>
						</div>
				  `
					: html`
			<${ContactButtonStyle} onClick=${() => {
							trackDemande(contact ? 'contact direct' : 'faire une demande')
							setSelected(true)
					  }}>${
							contact ? '📞 Contacter direct' : 'Faire une demande'
					  }</${ContactButtonStyle}>`
			}
		</li>
	`
}

const trackDemande = whichButton => {
	if (typeof _paq !== 'undefined')
		_paq.push(['trackEvent', 'trajets', 'demande', whichButton])
}

const DriverContact = ({ modeContact, contact }) => {
	// contact is a phone number, an email or undefined
	if(modeContact === 'Email' && contact !== undefined) {
		return html`
			<${ContactButtonStyle} href="mailto
			:${contact}">
				${contact}
			</${ContactButtonStyle}>`;
	}
	const tel = contact || config.tel || 'indisponible'
	return html`
		<${ContactButtonStyle} href="tel:${contact}"> 
			${contact ? `` : `Demande via ${config.nom}`} ${tel}
		</${ContactButtonStyle}>`;
	 
}
const FormContact = ({ from, to, moreInfo }) => {
	return html`
		<${ContactButtonStyle}
		onClick=${() => trackDemande('formulaire')}
	target="_blank"
	href=${config.formulaire_passager}
	>
	📄 Demande en ligne
		</${ContactButtonStyle}>
		`
}

