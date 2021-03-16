// @ts-check
import computeTripDetails from "../geography/computeTripDetails.js";
import computeDetour from "../helpers/computeDetour.js";
import "../helpers/typedef.js"

/**
 * @param {Trip}  tripRequest
 * @param {Map<Trip, TripProposal[]>} tripProposalsByTrip
 * @param {Map<string, Position>} positionByPlace
 * @return {(Trip | number)[][]}
 */
function getAdditionnalTimeByTrip(tripRequest, tripProposalsByTrip, positionByPlace) {
	const proposedTrips = [...tripProposalsByTrip.keys()]
	const tripDetailsByTrip = computeTripDetails(proposedTrips, tripRequest, positionByPlace);
	return proposedTrips
		.filter(trip => tripDetailsByTrip.has(trip)) // why ?
		.map(trip => {
			const additionalTime = computeDetour(tripDetailsByTrip.get(trip))
			// use another type ? set or map maybe ?
			return [trip, additionalTime]
		})
		.sort(
			// @ts-ignore
			([_1, additionalTime1], [_2, additionalTime2]) => additionalTime1 - additionalTime2
		)
}

/**
 * 
 * @param {*} tripProposalsByTrip - all trip proposals ordered by trip object
 * @param {*} trips - all trips object
 * @param {*} filter - additionnal time filter
 */
function getRelevantTrip(tripProposalsByTrip, trips, filter) {
	return trips
		.slice(0, 20)
		.filter(([_, additionalTime]) => filter(additionalTime))
		.map(([trip]) => {
			// get all tripProposal corresponding to the object trip {origin, destination}
			const tripProposals = tripProposalsByTrip.get(trip)
			return tripProposals
		}).flat()
}

export { getAdditionnalTimeByTrip, getRelevantTrip }