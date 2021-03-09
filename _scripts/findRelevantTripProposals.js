// @ts-check
/**
 * @typedef {Object} Trip
 * @property {string} origin
 * @property {string} destination
 */

import computeTripDetails from "../geography/computeTripDetails";

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

const KM = 1000 // meters
const AVERAGE_SPEED = 60 / 60 // km/min
const STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO = 1.4

function computeDetour(originalDistance, distanceWithDetour) {
	const additionalDistanceKM =
		((distanceWithDetour - originalDistance) *
			STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO) /
		KM

	const additionalTime = additionalDistanceKM * AVERAGE_SPEED
	return additionalTime
}

/**
 * @param {Trip}  tripRequest
 * @param {Map<Trip, TripProposal[]>} tripProposalsByTrip
 * @param {Map<string, Position>} positionByPlace
 * @returns {{ tripProposal: TripProposal, detourTime: number }[]}
 */
export default function findRelevantTripProposals(tripRequest, tripProposalsByTrip, positionByPlace) {
  const proposedTrips = [...tripProposalsByTrip.keys()]
  const tripDetailsByTrip = computeTripDetails(proposedTrips, tripRequest, positionByPlace);
  proposedTrips
		.filter(trip => tripDetailsByTrip.has(trip))
		.map(trip => {
			const tripDetails = tripDetailsByTrip.get(trip)
			const {
				originalDistance = 0,
				distanceWithDetour = Infinity
			} = tripDetails
			const detour = computeDetour(originalDistance, distanceWithDetour)
			return [trip, detour]
		})
		.sort(
			([_1, { additionalTime: a1 }], [_2, { additionalTime: a2 }]) => a1 - a2
		)
}