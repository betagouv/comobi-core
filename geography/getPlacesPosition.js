import {json} from 'd3-fetch'

export default function(places){
    console.log('places', places)
    return json(`/positions?${([...places].map(p => `p=${encodeURIComponent(p)}`).join('&'))}`)
    .then(positionObject => (new Map(Object.entries(positionObject))))
}

