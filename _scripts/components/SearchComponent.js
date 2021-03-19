import React, { useState } from 'react'
import htm from 'htm'
import CityInput from './CityInput'

const html = htm.bind(React.createElement)

export default function SearchComponent({
    tripRequest,
    validPlaceNames,
    onTripRequestChange
}) {
    const [origin, setOrigin] = useState( tripRequest.origin )
    const [destination, setDestination] = useState( tripRequest.destination )
    const [startDate, setStartDate] = useState(new Date())

    const reverseClicked = () => {
        setDestination(origin)
        setOrigin(destination)
    }

    /**
     * <label className="search-input  date-picker">
            <strong>Date</strong>
            <${DateTimePicker}
                onChange=${setStartDate}
                value=${startDate}
                format="dd-MM-yy h:mm:ss"
                minDate=${new Date()}
            />
        </label>
     */

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
        <button className="search-btn" type="submit">Rechercher</button>
    </form>
`
}