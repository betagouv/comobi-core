import {csv} from 'd3-fetch';

const BAN_SEARCH_LOT_SUFFIX = ' lot';
const BAN_INPUT_KEY = 'adresse'

export default function getPlacesPosition(places){
    const adressesCSV = `${BAN_INPUT_KEY}\n` + [...places].slice(0, 200).join(`${BAN_SEARCH_LOT_SUFFIX}\n`)
    const adresseCSVBANBody = new FormData();
    adresseCSVBANBody.append('data', new File([adressesCSV], 'adresses.csv'))
    
    return csv('https://api-adresse.data.gouv.fr/search/csv/', {
        method: 'POST',
        body: adresseCSVBANBody,
    }).then(banResults => {
        const map = new Map()

        for(const banResult of banResults){
            const {adresse, latitude, longitude} = banResult;
            if(latitude && longitude){
                const key = adresse.slice(0, adresse.indexOf(BAN_SEARCH_LOT_SUFFIX))
                map.set(key, {latitude: parseFloat(latitude), longitude: parseFloat(longitude), banResult})
            }
            else{
                console.warn('No lat/long', adresse, banResult)
            }
        }

        return map
    })
}
