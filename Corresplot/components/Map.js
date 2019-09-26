import React, {useState} from 'react'
import htm from 'htm'

import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'

import tripString from '../../geography/tripString.js'

const html = htm.bind(React.createElement);

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGF2aWRicnVhbnQiLCJhIjoiY2p5enA0MHNmMDNwbTNsdW9taDA4aWI3dCJ9.3P_tPQT5h2qvjrQYjAQSFQ';

const id = 'mapbox.streets';

const tileLayerURL = `https://api.tiles.mapbox.com/v4/${id}/{z}/{x}/{y}.png?access_token=${MAPBOX_ACCESS_TOKEN}`
const attribution = `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Directions by GoogleMaps`

const INITIAL_VIEWPORT = {
    center: [44.4491, 1.43663], // Cahors
    zoom: 10
}

export default function CorresplotMap({directionsByTrip, tripRequest, displayedDriverTrips, positionByPlace}){
    directionsByTrip = directionsByTrip || new Map()

    const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

    return html`
        <${Map} className="map" viewport=${viewport} onViewportChanged=${setViewport}>
            <${TileLayer}
                attribution=${attribution}
                url=${tileLayerURL}
            />
            ${
                tripRequest && directionsByTrip.has(tripRequest) ? 
                    html`
                        <${GeoJSON} className="trip-request" data=${directionsByTrip.get(tripRequest).geoJSON}>
                            <${Popup}>${tripString(tripRequest)}<//>
                        <//>` : 
                    undefined
            }
            ${
                [...displayedDriverTrips]
                .filter(trip => directionsByTrip.has(trip))
                .map(trip => html`
                    <${GeoJSON} className="driver-trip" data=${directionsByTrip.get(trip).geoJSON}>
                        <${Popup}>${tripString(trip)}<//>
                    <//>`
                )   
            }
            
        <//>`
}


// useful when one wants to show places positions on a map
/*['Le Boulvé', 'Cahors (Pradines)', 'Cahors', 'Girac']
.map(place => {
    const position = positionByPlace.get(place)
    if(position){
        console.log('position', place, position)
        const leafletPosition = {lat: position.latitude, lng: position.longitude}
        return html`
            <${Marker} position=${leafletPosition}>
                <${Popup}>${place}<//>
            <//>`
    }
})*/   
            