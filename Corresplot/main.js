import {createElement} from 'react'
import {render} from 'react-dom'
import htm from 'htm'
import Store from 'baredux'
import {json} from 'd3-fetch'

import Main from './components/Main.js'

import getDirections from './geography/getDirections.js';
import driverToTrip from './geography/driverToTrip';
import googleDirectionsToCorresplotDirections from './geography/googleDirectionsToCorresplotDirections.js'
import CorresplotMap from './components/Map';

const html = htm.bind(createElement);

function renderUI({driversByTrip, directionsByTrip}){
    render(
        html`<${Main} ...${{driversByTrip, directionsByTrip}} />`, 
        document.body
    )
}

const store = new Store({
    state: {
        driversByTrip: new Map(),
        directionsByTrip: new Map()
    },
    mutations: {
        addDrivers(state, driversByTrip){
            state.driversByTrip = new Map([...driversByTrip, ...state.driversByTrip])
        },
        addDirections(state, directionsByTrip){
            state.directionsByTrip = new Map([...state.directionsByTrip, ...directionsByTrip])
        }
    }
})

store.subscribe(state => {
    const {driversByTrip, directionsByTrip} = state

    renderUI({driversByTrip, directionsByTrip})
})

console.log(store.state)

// initial render 
renderUI(store.state)


function cleanupDrivers(drivers){
    for(const driver of drivers){
        driver['Départ'] = driver['Départ'].trim()
        driver['Arrivée'] = driver['Arrivée'].trim()
    }
    return drivers
}


json('/drivers')
.then(cleanupDrivers)
.then(drivers => {
    const driversByTrip = new Map()

    for(const driver of drivers){
        const trip = driverToTrip(driver);

        const tripDrivers = driversByTrip.get(trip) || []
        tripDrivers.push(driver)
        driversByTrip.set(trip, tripDrivers)
    }

    store.mutations.addDrivers(driversByTrip)

    // Limiting to 5 trips for now, because each refresh causes calls to Google Direction API which is payable
    const trips = [...driversByTrip.keys()].slice(0, 5)

    console.log('trips', trips)

    
    Promise.all(trips.map(trip => {
        return getDirections(trip)
        .then(googleDirections => {
            const corresplotDirections = googleDirectionsToCorresplotDirections(googleDirections)
            return corresplotDirections ? [trip, corresplotDirections] : undefined
        })
    }))
    .then(directions => store.mutations.addDirections(new Map(directions.filter(x => !!x))))
    .catch(console.error)

})
