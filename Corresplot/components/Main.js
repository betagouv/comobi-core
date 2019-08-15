import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js';
import Map from './Map.js'

const html = htm.bind(React.createElement);

export default function({driversByTrip, directionsByTrip, tripRequest, onTripRequestChange}){
    return html`
        <h1 key="h1">Lotocar</h1>
        <main  key="main">
            <${Map} directionsByTrip=${directionsByTrip} tripRequest=${tripRequest}/>
            <${TripSelection} driversByTrip=${driversByTrip} tripRequest=${tripRequest} onTripRequestChange=${onTripRequestChange}/>
        </main>
    `
}