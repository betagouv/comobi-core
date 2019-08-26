import React from 'react'
import htm from 'htm'

const html = htm.bind(React.createElement);

function Driver({driver, tripDetails, onDriverClick}){
    const {Départ, Arrivée, Horaires, Conducteurs, Contact, Adresse} = driver

    const phoneLink = Contact ? `tel:${Contact.trim()}` : undefined
    const emailLink = Adresse && Adresse.includes('@') ? `mailto:${Adresse.trim()}` : undefined

    let originalDistance, distanceWithDetour, detourClassName;

    if(tripDetails){
        originalDistance = tripDetails.originalDistance;
        distanceWithDetour = tripDetails.distanceWithDetour;

        detourClassName = distanceWithDetour <= 1.1*originalDistance ? 
        'minor-detour' : 
        (distanceWithDetour <= 1.5*originalDistance ?
            'medium-detour' : 
            'major-detour')
    }

    // in minutes, assuming average 70km/h
    const additionalTime = (distanceWithDetour - originalDistance)*(70/60)

    return html`
        <li className="driver" onClick=${onDriverClick}>
            <section className="${detourClassName} trip-details">
                <span>${tripDetails ? `+${Math.ceil(additionalTime)}mins` : undefined}</span>
            </section>
            <section>
                <span className="name">${Conducteurs}</span>
                <span className="proposed-trip">(${Départ} - ${Arrivée} - ${Horaires})</span>
                <span className="contact">
                    <a href="${phoneLink}">Téléphone</a>
                    <a href="${emailLink}">Email</a>
                </span>
            </section>
        </li>`
}

export default function DriversList({driversByTrip, tripRequest, tripDetailsByTrip, onTripClick}){
    const orderedTrips = [...driversByTrip.keys()].sort((trip1, trip2) => {
        const details1 = tripDetailsByTrip.get(trip1) || {originalDistance: 0, distanceWithDetour: Infinity}
        const details2 = tripDetailsByTrip.get(trip2) || {originalDistance: 0, distanceWithDetour: Infinity}

        const detour1 = details1.distanceWithDetour - details1.originalDistance
        const detour2 = details2.distanceWithDetour - details2.originalDistance

        return detour1 - detour2;
    })

    return html`
        <h2 key="h2">Conducteur.rice.s</h2>
        <ul key="ul" className="drivers-list">
            ${
                orderedTrips.map(trip => {
                    const drivers = driversByTrip.get(trip)
                    const tripDetails = tripDetailsByTrip.get(trip)

                    return drivers.map((driver, j) => {
                        return html`<${Driver} driver=${driver} tripDetails=${tripDetails} onDriverClick=${() => onTripClick(trip)}/>`
                    })
                })
            }
        </ul>`
}