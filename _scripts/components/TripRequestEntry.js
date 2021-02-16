import React, { useState } from 'react'
import htm from 'htm'
import styled from 'styled-components'
import escapeRegexp from 'escape-string-regexp'
import config from '../../_config.yml'
const html = htm.bind(React.createElement)

const cityInputElement = styled.input`
    margin: 0 0.6rem 0 0.6rem;
    border-radius: 0.3rem;
    padding: 0.2rem 0.3rem;
    font-size: 110%;
`

const datalistId = "valid-place-names"

// styledLabel is defined outside of CityInput because if it's defined inside,
// it interacts badly with React hooks (useState) in a way that defocuses the input
// after each character is typed
// This is a band-aid; the root cause has not been found
const styledLabel = styled.label` display: block; `

/** Si la liste est restreinte à une liste donnée
alors la valeur saisie doit être comprise dans cette liste
dans ce cas on ajouter une validation sur l'input
*/
const CityInput = ({ label, validPlaceNames, value, setValue }) => {
    const validation = config.liste_ville_restreinte !== undefined && config.liste_ville_restreinte.toLowerCase() === "oui";
    const pattern = validation ? validPlaceNames.map(s => escapeRegexp(s)).join('|') : undefined;
    const validationMessage = `Vous devez saisir un de ces lieux : ${validPlaceNames.join(', ')}`

    return html`
    <${styledLabel}>
        <${styled.strong`
            display: inline-block;
            width: 4.5rem;
        `}>${label}</strong>
        <${cityInputElement}
            type="text"
            list=${datalistId}
            value=${value}
            onChange=${e => {
                e.target.setCustomValidity('');
                const value = e.target.value
                setValue(value)
            }}
            pattern=${validation ? pattern : undefined}
            onInvalid=${validation ? e => {
                e.target.setCustomValidity(validationMessage);
            } : undefined}
            onBlur=${validation ? e => {
                e.target.checkValidity() // this triggers an 'invalid' event if input is invalid
            } : undefined}
        />
    </label>
    `
}

export default function TripRequestEntry({
    tripRequest,
    validPlaceNames,
    onTripRequestChange
}) {
    const [origin, setOrigin] = useState( tripRequest.origin )
    const [destination, setDestination] = useState( tripRequest.destination )

    return html`
        <${styled.h2`
            text-align: center;
            margin: 0 0 1.5rem;
        `} key="h2">Où allez-vous ?</h2>
        <form key="form" className="trip-request-entry" onSubmit=${e => {
            e.preventDefault()
            onTripRequestChange({ origin, destination })
        }}>
            <datalist id=${datalistId}>
                ${validPlaceNames.map(validPlaceName => {
                    return html`
                        <option key=${validPlaceName} value=${validPlaceName} />
                    `
                })}
            </datalist>
            <section className="geography">
                <${CityInput} 
                    key="départ" 
                    label="Départ"
                    validPlaceNames=${validPlaceNames}
                    value=${origin}
                    setValue=${setOrigin}
                />
                <${CityInput}
                    key="arrivée"
                    label="Arrivée"
                    validPlaceNames=${validPlaceNames}
                    value=${destination}
                    setValue=${setDestination}
                />
            </section>
            <button type="submit">Rechercher</button>
        </form>
    `
}
