// @ts-check
import computeTripDetails from "../geography/computeTripDetails.js";
import computeDetour from "../helpers/computeDetour.js";
import "../helpers/typedef.js"

/**
 * @param {Trip}  tripRequest
 * @param {Map<Trip, TripProposal[]>} tripProposalsByTrip
 * @param {Map<string, Position>} positionByPlace
 * @return {AdditionalTimeByTrip[]}
 */
function getAdditionnalTimeByTrip(tripRequest, tripProposalsByTrip, positionByPlace) {
	const proposedTrips = [...tripProposalsByTrip.keys()]
	const tripDetailsByTrip = computeTripDetails(proposedTrips, tripRequest, positionByPlace);
	return proposedTrips
		.filter(trip => tripDetailsByTrip.has(trip)) // why ?
		.map(trip => {
			const additionalTime = computeDetour(tripDetailsByTrip.get(trip))
			// use another type ? set or map maybe ?
			return {trip, additionalTime}
		})
		.sort(
			// @ts-ignore
			({_1, additionalTime1}, {_2, additionalTime2}) => additionalTime1 - additionalTime2
		)
}

/**
 * 
 * @param {Map<Trip, TripProposal[]>} tripProposalsByTrip - all trip proposals ordered by trip object
 * @param {AdditionalTimeByTrip[]} trips - all trip objects with additionnal time accordiing to a request
 * @param {function} filter - additionnal time filter
 * @return {TripProposal[]}
 */
function getRelevantTrip(tripProposalsByTrip, trips, filter) {
	return trips
		.slice(0, 20)
		.filter(({_, additionalTime}) => filter(additionalTime))
		.map(({trip}) => {
			// get all tripProposal corresponding to the object trip {origin, destination}
			return tripProposalsByTrip.get(trip)
		}).flat()
}

export { getAdditionnalTimeByTrip, getRelevantTrip }