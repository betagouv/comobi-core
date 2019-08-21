import {csv} from 'd3-fetch';

const BAN_SEARCH_LOT_SUFFIX = ' lot';
const BAN_PLACE_INPUT_KEY = 'adresse'

export default function getPlacesPosition(places){
    const adressesCSV = `${BAN_PLACE_INPUT_KEY}\n` + [...places].map(p => `${p}${BAN_SEARCH_LOT_SUFFIX}`).join(`\n`)
    const adresseCSVBANBody = new FormData();
    adresseCSVBANBody.append('data', new File([adressesCSV], 'adresses.csv'))
    
    return csv('https://api-adresse.data.gouv.fr/search/csv/', {
        method: 'POST',
        body: adresseCSVBANBody,
    }).then(banResults => {
        const map = new Map()

        for(const banResult of banResults){
            const {latitude, longitude} = banResult;
            const placeName = banResult[BAN_PLACE_INPUT_KEY]

            if(latitude && longitude){
                const key = placeName.slice(0, placeName.indexOf(BAN_SEARCH_LOT_SUFFIX))
                map.set(key, {latitude: parseFloat(latitude), longitude: parseFloat(longitude), banResult})
            }
            else{
                console.warn('No lat/long', placeName, banResult)
            }
        }

        return map
    })
}
