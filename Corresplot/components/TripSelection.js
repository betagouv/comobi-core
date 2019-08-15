import React from 'react'
import htm from 'htm'

import TripRequestEntry from './TripRequestEntry.js';
import DriverList from './DriverList.js'

const html = htm.bind(React.createElement);

export default function({driversByTrip, tripRequest, onTripRequestChange}){
    return html`
        <section className="trip-selection">
            <${TripRequestEntry} tripRequest=${tripRequest} onTripRequestChange=${onTripRequestChange}/>
            <${DriverList} driversByTrip=${driversByTrip}/>
        </section>
    `
}