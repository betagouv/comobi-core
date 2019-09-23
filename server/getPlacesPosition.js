import delay from 'delay';
import pRetry from 'p-retry';
import got from 'got';

export default function getPlacesPosition(places){
    return Promise.all([...places].map((place, i) => {
        const geoAPIURL = `https://geo.api.gouv.fr/communes?format=geojson&nom=${encodeURIComponent(place)}`

        return delay(places.size >= 20 ? i*25 : 0)
        .then( () => pRetry( () => got(geoAPIURL, {json: true}) ))
        .then(({body: geojsonResult}) => {
            // picking the first result ([0]) is fairly arbitrary
            // let's see how far we go with this
            const relevantResult = geojsonResult.features[0]
            if(!relevantResult){
                return undefined
            }
            else{
                // > GeoJSON describes an order for coordinates: they should go, in order:
                // > [longitude, latitude, elevation]
                // > This order can be surprising. Historically, the order of coordinates is usually “latitude, longitude”
                // https://macwright.org/2015/03/23/geojson-second-bite#position
                const [longitude, latitude] = relevantResult.geometry.coordinates
                return Number.isFinite(latitude) && Number.isFinite(longitude) ? 
                    [place, {latitude, longitude}] : 
                    undefined
            }
        })
        .catch(err => {
            console.error('Error from geo API', err)
            return undefined;
        })
    }))
    // remove entries for unfound positions
    .then(placePositionEntries => placePositionEntries.filter(x => !!x))
    .then(placePositionEntries => (new Map(placePositionEntries)))

}
