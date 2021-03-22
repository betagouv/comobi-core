// @ts-check
import React from 'react'
import htm from 'htm'
const html = htm.bind(React.createElement)

export default function AvalaibleTripLabel({TripListLength}) {
    return html`
    <p className="available-trip-label">
      <strong>${TripListLength} trajets </strong> disponibles</p>
  `
}