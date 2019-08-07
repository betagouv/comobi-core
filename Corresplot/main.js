import {createElement} from 'react'
import {render} from 'react-dom'
import htm from 'htm'
import Store from 'baredux'
import {json} from 'd3-fetch'

import Main from './components/Main.js'

import getPlacesPosition from './geography/getPlacesPosition';

const html = htm.bind(createElement);

function renderUI({drivers, positionsByPlace}){
    render(
        html`<${Main} ...${{drivers, positionsByPlace}} />`, 
        document.body
    )
}

const store = new Store({
    state: {
        drivers: [],
        positionsByPlace: new Map()
    },
    mutations: {
        addDrivers(state, drivers){
            state.drivers = [...drivers, ...state.drivers]
        },
        addPositionsByPlace(state, positionsByPlace){
            state.positionsByPlace = new Map([...state.positionsByPlace, ...positionsByPlace])
        }
    }
})

store.subscribe(state => {
    const {drivers, positionsByPlace} = state

    renderUI({drivers, positionsByPlace})
})

console.log(store.state)

// initial render 
renderUI(store.state)

json('/drivers')
.then(drivers => {
    store.mutations.addDrivers(drivers)

    getPlacesPosition(new Set(drivers.map(d => d['Départ'])))
    .then(banResults => {
        store.mutations.addPositionsByPlace(new Map(
            banResults.map( ({adresse, longitude, latitude}) => ([adresse, {lng: longitude, lat: latitude}]) )
        ))
    })
})
