import memoize from 'fast-memoize'

function _makeTrip(origin, destination) {
	return Object.freeze({ origin, destination })
}

export const makeTrip = memoize(_makeTrip)

export function driverToTrip(driver) {
	return makeTrip(driver['Départ'], driver['Arrivée'])
}

export default memoize(driverToTrip)
