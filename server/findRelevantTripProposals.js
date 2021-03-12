// @ts-check
import computeTripDetails from "../geography/computeTripDetails.js";
import computeDetour from "../helpers/computeDetour.js";
import "../helpers/typedef"

/**
 * @param {Trip}  tripRequest
 * @param {Map<Trip, TripProposal[]>} tripProposalsByTrip
 * @param {Map<string, Position>} positionByPlace
 * @return {(Trip | number)[][]}
 */
export default (tripRequest, tripProposalsByTrip, positionByPlace)  => {
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
			([_1, additionalTime1], [_2, additionalTime2]) => additionalTime1 - additionalTime2
		)
}