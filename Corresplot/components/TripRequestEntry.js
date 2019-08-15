import React, { useState, useEffect } from 'react'
import htm from 'htm'

const html = htm.bind(React.createElement);

export default function TripRequestEntry({tripRequest, onTripRequestChange}){
    const [origin, setOrigin] = useState(tripRequest.origin);
    const [destination, setDestination] = useState(tripRequest.destination);

    // pass new trip to state if it came from props
    useEffect(() => { setOrigin(tripRequest.origin) }, [tripRequest.origin])
    useEffect(() => { setDestination(tripRequest.destination) }, [tripRequest.destination])

    function onSubmit(e){
        e.preventDefault()
        onTripRequestChange({
            origin,
            destination
        })
    }

    return html`
        <h2 key="h2">Demande de trajet</h2>
        <form key="form" className="trip-request-entry" onSubmit=${onSubmit}>
            <section className="geography">
                <label>
                    <strong>Départ</strong>
                    <input className="origin" type="text" value=${origin} onChange=${e => setOrigin(e.target.value)}/>
                </label> 
                <label>
                    <strong>Arrivée</strong>
                    <input className="destination" type="text" value=${destination} onChange=${e => setDestination(e.target.value)}/>
                </label>
            </section>

            <button type="submit">Ok</button>
        </form>`
}