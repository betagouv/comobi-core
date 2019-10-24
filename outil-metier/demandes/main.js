import {createElement} from 'react'
import {render} from 'react-dom'
import htm from 'htm'
import {json} from 'd3-fetch'

import positionByPlace from '../../geography/positionByPlace.js'
import getPlacesPosition from '../../geography/getPlacesPosition.js'

import Main from './components/Main.js'

import {REQUEST_STATUS_KEY, REQUEST_STATUS_NO_RELEVANT_DRIVER_VALUE} from '../../spreadsheetDatabase/requestStatusConstants.js'

const html = htm.bind(createElement);

const store = {
    requests: [],
    positionByPlace
}

function renderUI(){
    const relevantRequests = store.requests.filter(r => r[REQUEST_STATUS_KEY] === REQUEST_STATUS_NO_RELEVANT_DRIVER_VALUE)

    console.log('all requests', store.requests.length, 'relevant requests', relevantRequests.length)

    render(
        html`<${Main} requests=${relevantRequests} positionByPlace=${positionByPlace} />`, 
        document.body.querySelector('main')
    )
}

// initial render
renderUI();


// getting the data
json('/requests')
.then(requests => {
    console.log('requests', requests)
    store.requests = requests;
    renderUI();

    return requests;
})
.then(requests => {
    const placeNames = new Set()

    for(const {Départ, Arrivée} of requests){
        placeNames.add( Départ )
        placeNames.add( Arrivée )
    }

    return getPlacesPosition(placeNames)
    .then(newPositionByPlace => {
        for(const [place, position] of newPositionByPlace){
            positionByPlace.set(place, position)
        }
    })

})
.then(renderUI)
.catch(console.error)
