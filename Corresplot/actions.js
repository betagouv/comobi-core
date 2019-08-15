import { makeTrip } from './geography/driverToTrip';
import getDirections from './geography/getDirections.js';
import googleDirectionsToCorresplotDirections from './geography/googleDirectionsToCorresplotDirections.js'

export default function _actions(store){
    return {
        setTripRequestAndFindDirections(tripRequest){
            const {origin, destination} = tripRequest
            const trip = makeTrip(origin, destination)
            
            const directions = store.state.directionsByTrip.get(trip)
            if(!directions){
                getDirections(trip)
                .then(googleDirections => {
                    const corresplotDirections = googleDirectionsToCorresplotDirections(googleDirections)
                    if(corresplotDirections){
                        store.mutations.addDirections(new Map([[trip, corresplotDirections]]))
                    }
                })
                .catch(console.error)
            }

            store.mutations.setTripRequest(trip)
        }
    }
}