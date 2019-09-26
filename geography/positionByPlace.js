
// There is no cleanup implemented here, so the map memory can only grow
// In the worst case, it could lead to memory exhaustion and server shutting down in the worst case
const positionByPlace = new Map()

export function normalizePlaceName(place){
    return place.trim().toLowerCase()
}

export default {
    get(place){
        return positionByPlace.get(normalizePlaceName(place))
    },
    set(place, position){
        positionByPlace.set(normalizePlaceName(place), position)
    }
}