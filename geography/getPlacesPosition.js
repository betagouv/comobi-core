import {json} from 'd3-fetch'
import {chunk} from 'lodash-es'

export default function(places){
    // places can be a large set, which in turn may lead to a large URL
    // splitting the set so we don't run into "too large URL" HTTP errors
    return Promise.all(chunk([...places], 100).map(somePlaces => {
        return json(`/positions?${(somePlaces.map(p => `p=${encodeURIComponent(p)}`).join('&'))}`)
    }))
    .then(chunksResults => {
        const entries = []
        
        for(const positionsObject of chunksResults){
            entries.push(...Object.entries(positionsObject))
        }
        
        return new Map(entries);
    })
}
