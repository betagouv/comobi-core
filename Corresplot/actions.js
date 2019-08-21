import { makeTrip } from './geography/driverToTrip';
import getDirections from './geography/getDirections.js';
import googleDirectionsToCorresplotDirections from './geography/googleDirectionsToCorresplotDirections.js'
import getPlacesPosition from './geography/getPlacesPosition.js'

export default function _actions(store){
    return {
        setAndPrepareForTripRequest(tripRequest){
            const {origin, destination} = tripRequest
            tripRequest = undefined;
            const trip = makeTrip(origin, destination)

            const proposedTrips = [...store.state.driversByTrip.keys()]

            const positionByPlace = store.state.positionByPlace

            const placesWithoutPositions = new Set([
                ...proposedTrips.map(({origin, destination}) => [origin, destination]).flat(),
                trip.origin,
                trip.destination
            ])
            for(const place of positionByPlace.keys()){
                placesWithoutPositions.delete(place)
            }

            getPlacesPosition(placesWithoutPositions)
            .then(positionByPlace => {
                store.mutations.addPositions(positionByPlace);
            })
            .catch(console.error)
            
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