import React from 'react'
import htm from 'htm'

import DriversList from './DriverList.js';
import Map from './Map.js'

const html = htm.bind(React.createElement);

export default function({driversByTrip, directionsByTrip}){
    return html`
        <h1>Lotocar</h1>
        <main>
            <${Map} directionsByTrip=${directionsByTrip}/>
        </main>
    `
}