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
   * @param {string} Jour 
   * @returns
   */
  const getDate = (Jour) => {
    console.log(Jour)
    const date = parse(Jour, 'MM/dd/yyyy', new Date())
    const days = { E: format(date, 'E'), dMM : format(date, 'd LLL') }
    console.log(days)
    return { E: format(date, 'E'), dLLL : format(date, 'd LLL') }
  }

  const dateElement = html`
  ${(Jours !== '') ?
    html`<td className="datetime">${Jours}</td>` :
    html`<td className="date">
      ${(Jour !== '') && html`<span className="light">${getDate(Jour).E}</span>`}
      ${(Jour !== '') && html`<span>${getDate(Jour).dLLL}</span>`}
    </td>`
  }`

  return html`
    <tr className="inline-trip">
      ${dateElement}
      ${heureDepart !== '-' && html`<td className="light">${heureDepart}</td>`}
      <td>${Départ}</td>
      <td>${Arrivée}</td>
      <td className="place-number">
        <img src="./images/icons/member.svg"/>
        <img src="./images/icons/member.svg"/>
      </td>
      <td><button className="search-btn">Contacter ${Prénom}</button></td>
    </tr>`
}

/**
 * 
 */


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