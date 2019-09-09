import {json} from 'd3-fetch'

function positionQueryString(position){
    // https://developers.google.com/maps/documentation/directions/intro#required-parameters
    // generating the "origin=41.43206,-81.38992" version
    return `${position.latitude},${position.longitude}`
}

export default function getDirections({origin, destination}, positionByPlace){
    const originPosition = positionByPlace.get(origin)
    const destinationPosition = positionByPlace.get(destination)

    if(originPosition && destinationPosition){
        return json(
            `/directions?origin=${positionQueryString(originPosition)}&destination=${positionQueryString(destinationPosition)}`
        )
    }
    else{
        return Promise.reject(new Error(`no position for origin or destination (${origin}, ${destination})`))
    }
    
}