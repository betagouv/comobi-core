import React from 'react'
import htm from 'htm'

const html = htm.bind(React.createElement);

export default function DriversList({drivers}){
    return html`<ul>
        ${
            drivers.map(
                ({Départ, Arrivée, Horaires}, i) => html`<li key="${i}">${Départ} => ${Arrivée}. ${Horaires}</li>`
            )
        }
    </ul>`
}