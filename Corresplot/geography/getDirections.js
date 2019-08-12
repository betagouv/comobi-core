import {json} from 'd3-fetch'

export default function getDirections({origin, destination}){
    const url = `/directions?origin=${origin}&destination=${destination}`
    return json(url)
}