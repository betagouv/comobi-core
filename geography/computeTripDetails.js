// this function has been moved in findeRelevantTripProposals
// @ts-check
import LatLon from 'geodesy/latlon-spherical.js';
import "../helpers/typedef.js"

/**
 * 
 * @param {Position} p1 
 * @param {Position} p2 
 * @return number
 */
function distance2(p1, p2){
    const ll1 = new LatLon(p1.latitude, p1.longitude);
    const ll2 = new LatLon(p2.latitude, p2.longitude);
    return ll1.distanceTo(ll2);
}

/**
 * @param  {Position[]} points 
 * @return number
 */
function distance(...points){
    if(points.length <= 1)
        return 0;

    const [p1, p2, ...rest] = points;

    return distance2(p1, p2) + distance(p2, ...rest)
}

/**
 * 
 * @param {Trip[]} proposedTrips 
 * @param {Trip} tripRequest 
 * @param {Map<string, Position>} positionByPlace 
 * @return {Map<Trip, TripDetails>}
 */
export default function computeTripDetails(proposedTrips, tripRequest, positionByPlace){
    const tripDetailsByTrip = new Map()
    for(const proposedTrip of proposedTrips){
        const tripPositionsWithDetour = 
        [proposedTrip.origin, tripRequest.origin, tripRequest.destination, proposedTrip.destination]
            .map(place => positionByPlace.get(place))

        // if not all positions have a place, do not compute
        if(tripPositionsWithDetour.every(p => Object(p) === p)){
            const originalDistance = distance(tripPositionsWithDetour[0], tripPositionsWithDetour[3])
            const distanceWithDetour = distance(...tripPositionsWithDetour)

            tripDetailsByTrip.set(proposedTrip, {originalDistance, distanceWithDetour})
        }
    }

    return tripDetailsByTrip
}