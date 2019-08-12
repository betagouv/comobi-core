export default function({origin, destination, waypoints = []}){
    return [origin, ...waypoints, destination].join(' - ')
}