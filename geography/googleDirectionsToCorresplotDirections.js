import polyline from '@mapbox/polyline'

export default function googleDirectionsToCorresplotDirections(googleDirections){
    const route = googleDirections.routes[0]
    if(route){
        const leg = route.legs[0]

        return {
            distance: leg.distance.value, // inferable from points
            duration: leg.duration.value, // inferable from points
            origin: { // part of original request
                text: leg.start_address, 
                position: leg.start_location
            },
            destination: { // part of original request
                text: leg.end_address,
                position: leg.end_location
            },
            geoJSON : polyline.toGeoJSON(route.overview_polyline.points) // allowed to be cached
        }
    }
    else{
        return undefined
    }
    
}