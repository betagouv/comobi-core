import {createElement} from 'react'
import {render} from 'react-dom'
import htm from 'htm'
import Store from 'baredux'
import {json} from 'd3-fetch'

import Main from './components/Main.js'

import driverToTrip from './geography/driverToTrip';
import computeTripDetails from './geography/computeTripDetails';

import _actions from './actions.js';

const html = htm.bind(createElement);

const store = new Store({
    state: {
        driversByTrip: new Map(),
        directionsByTrip: new Map(),
        positionByPlace: new Map(),
        tripRequest: {
            origin: '',
            destination: ''
        }
    },
    mutations: {
        addDrivers(state, driversByTrip){
            // BUG if there are drivers for the same trip in both driversByTrip and state.driversByTrip, only some are kept because they use the same key
            state.driversByTrip = new Map([...state.driversByTrip, ...driversByTrip])
        },
        addDirections(state, directionsByTrip){
            state.directionsByTrip = new Map([...state.directionsByTrip, ...directionsByTrip])
        },
        addPositions(state, positionByPlace){
            state.positionByPlace = new Map([...state.positionByPlace, ...positionByPlace])
        },
        setTripRequest(state, tripRequest){
            state.tripRequest = tripRequest
        }
    }
})

const actions = _actions(store)

function renderUI(store){
    const {driversByTrip, directionsByTrip, positionByPlace, tripRequest} = store.state
    //const {setTripRequest} = store.mutations
    const {setAndPrepareForTripRequest} = actions

    const proposedTrips = [...driversByTrip.keys()]

    const tripDetailsByTrip = computeTripDetails(proposedTrips, tripRequest, positionByPlace)

    render(
        html`<${Main} ...${ {
            driversByTrip, directionsByTrip, tripRequest, tripDetailsByTrip,
            onTripRequestChange(tripRequest){ setAndPrepareForTripRequest(tripRequest) }
        } } />`, 
        document.body
    )
}



store.subscribe(state => {
    renderUI(store)
})

console.log(store.state)

// initial render 
renderUI(store)

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

})
