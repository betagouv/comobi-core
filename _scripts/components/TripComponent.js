// @ts-check
import React from 'react'
import htm from 'htm'
import { parse, format } from 'date-fns'
import '../../helpers/typedef.js'
const html = htm.bind(React.createElement)

// Do I need trip request ? 

/**
 * @typedef {Object} Props
 * @property {TripProposal} tripProposal
 * @property {string} tripKey
 */

/**
 * @param {Props} props
 */
export default function TripComponent({ tripProposal, tripKey }) {
  console.log(tripProposal)
  const {
		Départ,
		Arrivée,
		Jours,
		Jour,
		heureDepart,
		driver: { Prénom, Nom, contact, lieu, modeContact }
	} = tripProposal
    /**
   * ${(Jours !== '') ? 
									html`<span className="datetime">${Jours}</span>` : 
									(Jour !== '') && html`<span className="datetime">Le ${Jour}</span>`
									}
									${heureDepart !== '-' &&
										html`
											<span className="datetime"> à ${heureDepart}</span>
										`}
   */

    /**
     * @param {string} Jour 
     * @returns
     */
    const getDate = (Jour) => {
      const date = parse('02/11/2014', 'MM/dd/yyyy', new Date())
      return { E: format(date, 'E'), dMM : format(date, 'd MM') }
    }
    return html`
      <li className="inline-trip">
        <div className="date">
          <p>${(Jours !== '') ? 
          html`<span className="datetime">${Jours}</span>` : 
          (Jour !== '') && html`<span className="datetime">${getDate(Jour)}</span>`}
          </p>
          <p>
          ${(Jour !== '') && html`<span className="datetime">${getDate(Jour)}</span>`}
          </p>
        </div>
        <p>${heureDepart !== '-' &&
          html`
            <span className="datetime"> à ${heureDepart}</span>
        `}</p>
        <p>${Départ}</p>
        <p>${Arrivée}</p>
        <div className="place-number">
          <img src="./imamges/icons/member.svg"/>
          <img src="./imamges/icons/member.svg"/>
        </div>
        <button className="search-btn">Contacter ${Prénom}</button>
      </div>
    </li>
  `
}
// ADD DRIVER POPUP
/*
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
}*/