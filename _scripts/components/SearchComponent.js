import React, { useState } from 'react'
import htm from 'htm'
import CityInput from './CityInput'
import DatePicker from 'react-datepicker'
import TimePicker from 'react-time-picker'

const html = htm.bind(React.createElement)

export default function SearchComponent({
    tripRequest,
    validPlaceNames,
    onTripRequestChange
}) {
    const [origin, setOrigin] = useState( tripRequest.origin )
    const [destination, setDestination] = useState( tripRequest.destination )
    const [startDate, setStartDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())

    const reverseClicked = () => {
        setDestination(origin)
        setOrigin(destination)
    }
    return html `
    <form key="form" className="search-form" onSubmit=${e => {
        e.preventDefault()
        onTripRequestChange({ origin, destination })
    }}>
        <${CityInput} 
            key="départ" 
            label="Départ"
            validPlaceNames=${validPlaceNames}
            value=${origin}
            setValue=${setOrigin}
        />
        <img 
            key="icon"
            className="icon" 
            src="./images/icons/double-arrow.svg"
            onClick=${reverseClicked}
        />
        <${CityInput}
            key="arrivée"
            label="Arrivée"
            validPlaceNames=${validPlaceNames}
            value=${destination}
            setValue=${setDestination}
        />
        <label className="search-input">
            <strong>Date</strong>
            <${DatePicker}
                onChange=${setStartDate}
                value=${startDate}
                calendarIcon=${null}
                format=${'dd-MM-y'}
                minDate=${new Date()}
                className="city-input"
            />
        </label>
        <label className="search-input">
            <strong>Time</strong>
            <${TimePicker}
                onChange=${setStartTime}
                value=${startTime}
                clockIcon=${null}
                disableClock=${true}
                format=${'HH:mm'}
                className="city-input"
            />
        </label>
        <div className="search-input">
        <button className="search-btn" type="submit">Rechercher</button>
        </div>
    </form>
`
}