// @ts-check
import "../helpers/typedef.js"

const KM = 1000 // meters
const AVERAGE_SPEED = 60 / 60 // km/min
const STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO = 1.4

/**
 * 
 * @param {TripDetails} tripDetails
 * @return {number}
 */
export default (tripDetails) => {
	const additionalDistanceKM =
		((tripDetails.distanceWithDetour - tripDetails.originalDistance) *
			STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO) /
		KM

	const additionalTime = additionalDistanceKM * AVERAGE_SPEED

	return additionalTime
}