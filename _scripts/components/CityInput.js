import React, { useState } from 'react'
import htm from 'htm'
import styled from 'styled-components'
import escapeRegexp from 'escape-string-regexp'
import config from '../../_config.yml'
const html = htm.bind(React.createElement)

export default function CityInput({ label, validPlaceNames, value, setValue }) {
    const validation = config.liste_ville_restreinte !== undefined && config.liste_ville_restreinte.toLowerCase() === 'oui'
    const pattern = validation ? validPlaceNames.map(s => escapeRegexp(s)).join('|') : undefined
    const validationMessage = `Vous devez saisir un de ces lieux : ${validPlaceNames.join(', ')}`
    const datalistId = 'valid-place-names'

    return html`
    <label className="search-input">
        <datalist id=${datalistId}>
            ${validPlaceNames.map(validPlaceName => {
        return html`
                    <option key=${validPlaceName} value=${validPlaceName} />
                `
    })}
        </datalist>
        <strong>${label}</strong>
        <input
            className="city-input"
            type="text"
            list=${datalistId}
            value=${value}
            onChange=${e => {
        e.target.setCustomValidity('')
        const value = e.target.value
        setValue(value)
    }}
            pattern=${validation ? pattern : undefined}
            onInvalid=${validation ? e => {
        e.target.setCustomValidity(validationMessage)
    } : undefined}
            onBlur=${validation ? e => {
        e.target.checkValidity() // this triggers an 'invalid' event if input is invalid
    } : undefined}
        />
    </label>
    `
}