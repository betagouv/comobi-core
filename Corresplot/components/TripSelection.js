import React from 'react'
import htm from 'htm'

import TripRequestEntry from './TripRequestEntry.js';
import DriverList from './DriverList.js'

const html = htm.bind(React.createElement);

export default function({tripProposalsByTrip, tripRequest, tripDetailsByTrip, onTripRequestChange, onTripClick}){
    return html`
        <section className="trip-selection">
            <h1>Lotocar</h1>
            <${TripRequestEntry} tripRequest=${tripRequest} onTripRequestChange=${onTripRequestChange}/>
            <${DriverList} tripProposalsByTrip=${tripProposalsByTrip} tripDetailsByTrip=${tripDetailsByTrip} onTripClick=${onTripClick}/>
        </section>
    `
}