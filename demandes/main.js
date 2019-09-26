import {createElement} from 'react'
import {render} from 'react-dom'
import htm from 'htm'
import {json} from 'd3-fetch'

import positionByPlace from '../geography/positionByPlace.js'
import getPlacesPosition from '../geography/getPlacesPosition.js'

import Main from './components/Main.js'

const html = htm.bind(createElement);

const store = {
    requests: undefined,
    positionByPlace
}

function renderUI(){
    render(
        html`<${Main} requests=${store.requests} positionByPlace=${positionByPlace} />`, 
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

    console.log()

    return getPlacesPosition(placeNames)
    .then(newPositionByPlace => {
        for(const [place, position] of newPositionByPlace){
            positionByPlace.set(place, position)
        }
    })

})
.then(renderUI)
.catch(console.error)
