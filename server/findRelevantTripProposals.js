// @ts-check
/**
 * @typedef {Object} Trip
 * @property {string} origin
 * @property {string} destination
 */


import computeTripDetails from "../geography/computeTripDetails.js";


/**
 * @typedef {Object} Driver
 * @property {string} modeContact
 * @property {string} contact
 * @property {string} lieu
 * /

 /**
 * @typedef {Object} TripProposal
 * @property {string} Départ
 * @property {string} Arrivée
 * @property {string} Trajet
 * @property {string} Jours
 * @property {string} Jour
 * @property {Driver} driver
 */
// @property {string} `Heure départ`

/**
 * @typedef {Object} Position
 * @property {number} latitude
 * @property {number} longitude
 */

/*
import LatLon from 'geodesy/latlon-spherical.js';
function distance2(p1, p2){
    const ll1 = new LatLon(p1.latitude, p1.longitude);
    const ll2 = new LatLon(p2.latitude, p2.longitude);
    return ll1.distanceTo(ll2);
}

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
 * @return {Map<Trip, {originalDistance: number, distanceWithDetour: number}>}}
 */
/* function computeTripDetails(proposedTrips, tripRequest, positionByPlace){
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
}*/

////////////
///// FROM computeDetour.js
const KM = 1000 // meters
const AVERAGE_SPEED = 60 / 60 // km/min
const STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO = 1.4

/**
 * 
 * @param {number} originalDistance 
 * @param {number} distanceWithDetour
 * @return {number}
 */
function computeDetour (originalDistance, distanceWithDetour) {
	const additionalDistanceKM =
		((distanceWithDetour - originalDistance) *
			STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO) /
		KM

	const detourClass =
		additionalDistanceKM <= 5 * AVERAGE_SPEED
			? 'minor-detour'
			: additionalDistanceKM <= 15 * AVERAGE_SPEED
				? 'medium-detour'
				: 'major-detour'

	const additionalTime = additionalDistanceKM * AVERAGE_SPEED
	// detourClass is never used so I removed it
	return additionalTime
}
/////

/**
 * @param {Trip}  tripRequest
 * @param {Map<Trip, TripProposal[]>} tripProposalsByTrip
 * @param {Map<string, Position>} positionByPlace
 */
export default (tripRequest, tripProposalsByTrip, positionByPlace)  => {
	const proposedTrips = [...tripProposalsByTrip.keys()]
	const tripDetailsByTrip = computeTripDetails(proposedTrips, tripRequest, positionByPlace);
	proposedTrips
		.filter(trip => tripDetailsByTrip.has(trip)) // why ?
		.map(trip => {
			const tripDetails = tripDetailsByTrip.get(trip)
			const {
				originalDistance = 0,
				distanceWithDetour = Infinity
			} = tripDetails
			const additionalTime = computeDetour(originalDistance, distanceWithDetour)
			// use another type ? set or map maybe ?
			return [trip, additionalTime]
		})
		.sort(
			([_1, additionalTime1], [_2, additionalTime2]) => additionalTime1 - additionalTime2
		)
}