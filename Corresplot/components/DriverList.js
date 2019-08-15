import React from 'react'
import htm from 'htm'

const html = htm.bind(React.createElement);

export default function DriversList({driversByTrip}){
    return html`
        <h2 key="h2">Conducteur.rice.s</h2>
        <ul key="ul" className="drivers-list">
            ${
                [...driversByTrip.values()].flat().map(
                    (driver, i) => {
                        const {Départ, Arrivée, Horaires, Conducteurs, Contact, Adresse} = driver

                        const phoneLink = Contact ? `tel:${Contact.trim()}` : undefined
                        const emailLink = Adresse && Adresse.includes('@') ? `mailto:${Adresse.trim()}` : undefined

                        return html`
                            <li key="${i}" className="driver">
                                <span className="name">${Conducteurs}</span>
                                <span className="proposed-trip">(${Départ} - ${Arrivée} - ${Horaires})</span>
                                <span className="contact">
                                    <a href="${phoneLink}">Téléphone</a>
                                    <a href="${emailLink}">Email</a>
                                </span>
                            </li>`
                    })
            }
        </ul>`
}