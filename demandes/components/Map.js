import React, {useState} from 'react'
import htm from 'htm'

import { Map as LeafletMap, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import L from 'leaflet'

import {normalizePlaceName} from '../../geography/positionByPlace.js'

const html = htm.bind(React.createElement);

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGF2aWRicnVhbnQiLCJhIjoiY2p5enA0MHNmMDNwbTNsdW9taDA4aWI3dCJ9.3P_tPQT5h2qvjrQYjAQSFQ';

const id = 'mapbox.streets';

const tileLayerURL = `https://api.tiles.mapbox.com/v4/${id}/{z}/{x}/{y}.png?access_token=${MAPBOX_ACCESS_TOKEN}`
const attribution = `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Directions by GoogleMaps`

const INITIAL_VIEWPORT = {
    center: [44.4491, 1.43663], // Cahors
    zoom: 10
}

function computeRequestMapData(requests){
    const mapData = new Map()

    for(const {Départ, Arrivée} of requests){
        const normD = normalizePlaceName(Départ)
        const originCounts = mapData.get(normD) || {origin: 0, destination: 0}
        originCounts.origin += 1;
        mapData.set(normD, originCounts)

        const normA = normalizePlaceName(Arrivée)
        const destinationCounts = mapData.get(normA) || {origin: 0, destination: 0}
        destinationCounts.destination += 1;
        mapData.set(normA, destinationCounts)
    }

    return mapData
}

function makeRequestsIcon(originCount, destinationCount){
    return L.divIcon({
        className: "request-marker",
        html: `
            ${originCount >= 1 ? `<div class="origin">${originCount}</div>` : ''}
            ${destinationCount >= 1 ? `<div class="destination">${destinationCount}</div>` : ''}
        `,
        iconSize: 40
    })
}

export default function RequestsMap({requests, positionByPlace}){

    const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

    return html`
        <${LeafletMap} className="map" viewport=${viewport} onViewportChanged=${setViewport}>
            <${TileLayer}
                attribution=${attribution}
                url=${tileLayerURL}
            />

            ${
                requests && [...computeRequestMapData(requests)].map(([place, counts]) => {
                    const position = positionByPlace.get(place)
                    return html`
                        ${
                            position ?
                                html` <${Marker} position=${{lat: position.latitude, lng: position.longitude}} icon=${makeRequestsIcon(counts.origin, counts.destination)}>
                                    <${Popup}>${place}<//>
                                <//>` :
                                undefined
                        }
                    `
                })
            }
        <//>
        <section className="legend">
            <h1>Légende</h1>
            <h2>Trajets non-honorés parce que pas de conducteur.rice pertinent.e</h2>
            <ul>
                <li>
                    <div className="request-marker">
                        <div className="origin">4</div>
                    </div>
                    4 personnes souhaitaient partir de cette ville
                </li>
                <li>
                    <div className="request-marker">
                        <div className="destination">7</div>
                    </div>
                    7 personnes souhaitaient arriver à cette ville
                </li>
            </ul>
        </section>
    `
}

/*
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
*/