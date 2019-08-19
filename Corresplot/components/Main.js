import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js';
import Map from './Map.js'

const html = htm.bind(React.createElement);

export default function({driversByTrip, directionsByTrip, tripRequest, tripDetailsByTrip, onTripRequestChange}){
    return html`
        <main>
            <${Map} directionsByTrip=${directionsByTrip} tripRequest=${tripRequest}/>
            <${TripSelection} driversByTrip=${driversByTrip} tripRequest=${tripRequest} tripDetailsByTrip=${tripDetailsByTrip} onTripRequestChange=${onTripRequestChange}/>
        </main>
    `
}