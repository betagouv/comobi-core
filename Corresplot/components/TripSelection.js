import React from 'react'
import htm from 'htm'

import TripRequestEntry from './TripRequestEntry.js';
import DriverList from './DriverList.js'

const html = htm.bind(React.createElement);

export default function({driversByTrip, tripRequest, tripDetailsByTrip, onTripRequestChange}){
    return html`
        <section className="trip-selection">
            <h1>Lotocar</h1>
            <${TripRequestEntry} tripRequest=${tripRequest} onTripRequestChange=${onTripRequestChange}/>
            <${DriverList} driversByTrip=${driversByTrip} tripDetailsByTrip=${tripDetailsByTrip}/>
        </section>
    `
}