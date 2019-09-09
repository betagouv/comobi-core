import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js';
import Map from './Map.js'

const html = htm.bind(React.createElement);

export default function({driversByTrip, directionsByTrip, tripRequest, tripDetailsByTrip, displayedDriverTrips, positionByPlace, onTripRequestChange, onTripClick}){
    return html`
        <main>
            <${Map} directionsByTrip=${directionsByTrip} tripRequest=${tripRequest} displayedDriverTrips=${displayedDriverTrips} positionByPlace=${positionByPlace}/>
            <${TripSelection} driversByTrip=${driversByTrip} tripRequest=${tripRequest} tripDetailsByTrip=${tripDetailsByTrip} onTripRequestChange=${onTripRequestChange} onTripClick=${onTripClick}/>
        </main>
    `
}