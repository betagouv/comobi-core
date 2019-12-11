const KM = 1000 // meters
const AVERAGE_SPEED = 60 / 60 // km/min
const STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO = 1.4

export default (originalDistance, distanceWithDetour) => {
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
	return { additionalTime, detourClass }
}
