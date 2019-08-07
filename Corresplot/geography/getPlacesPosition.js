
import {csv} from 'd3-fetch';

export default function getPlacesPosition(places){
    const adressesCSV = 'adresse\n' + [...places].slice(0, 200).join(' lot\n')
    const adresseCSVBANBody = new FormData();
    adresseCSVBANBody.append('data', new File([adressesCSV], 'adresses.csv'))
    
    return csv('https://api-adresse.data.gouv.fr/search/csv/?lat=44.4491&lon=1.43663', {
        method: 'POST',
        body: adresseCSVBANBody,
    })
    .then(results => {
        return results
    })
}
