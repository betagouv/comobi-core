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

            const proposedTrips = [...store.state.tripProposalsByTrip.keys()]

            const positionByPlace = store.state.positionByPlace

            const placesWithoutPositions = new Set([
                ...proposedTrips.map(({origin, destination}) => [origin, destination]).flat(),
                trip.origin,
                trip.destination
            ])
            for(const place of positionByPlace.keys()){
                placesWithoutPositions.delete(place)
            }

            const newPositionByPlaceP = getPlacesPosition(placesWithoutPositions)
            .then(positionByPlace => {
                store.mutations.addPositions(positionByPlace);
                return positionByPlace
            })
            .catch(console.error)
            
            const directions = store.state.directionsByTrip.get(trip)
            if(!directions){
                newPositionByPlaceP
                .then(newPositionByPlace => {
                    getDirections(trip, new Map([...positionByPlace, ...newPositionByPlace]))
                    .then(googleDirections => {
                        const corresplotDirections = googleDirectionsToCorresplotDirections(googleDirections)
                        if(corresplotDirections){
                            store.mutations.addDirections(new Map([[trip, corresplotDirections]]))
                        }
                    })
                    .catch(console.error)
                })
                
            }

            store.mutations.setTripRequest(trip)
            store.mutations.displayedDriverTrips.clear()
        },
        toggleTripDisplay(trip){
            const {displayedDriverTrips, positionByPlace} = store.state;

            if(displayedDriverTrips.has(trip)){
                store.mutations.displayedDriverTrips.delete(trip)
            }
            else{
                store.mutations.displayedDriverTrips.add(trip)

                // making sure we have directions to draw
                const directions = store.state.directionsByTrip.get(trip)
                if(!directions){
                    getDirections(trip, positionByPlace)
                    .then(googleDirections => {
                        const corresplotDirections = googleDirectionsToCorresplotDirections(googleDirections)
                        if(corresplotDirections){
                            store.mutations.addDirections(new Map([[trip, corresplotDirections]]))
                        }
                    })
                    .catch(console.error)
                }
            }
        }
    }
}