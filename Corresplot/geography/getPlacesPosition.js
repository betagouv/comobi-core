import {json} from 'd3-fetch'

export default function(places){
    console.log('places', places)
    return json(`/positions?${([...places].map(p => `places[]=${encodeURIComponent(p)}`).join('&'))}`)
    .then(positionObject => (new Map(Object.entries(positionObject))))
}

