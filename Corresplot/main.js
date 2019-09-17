import {createElement} from 'react'
import {render} from 'react-dom'
import htm from 'htm'
import Store from 'baredux'
import {json} from 'd3-fetch'

import Main from './components/Main.js'

import {makeTrip as driverTripProposalToTrip} from './geography/driverToTrip';
import computeTripDetails from './geography/computeTripDetails';

import _actions from './actions.js';

const html = htm.bind(createElement);

const store = new Store({
    state: {
        tripProposalsByTrip: new Map(),
        directionsByTrip: new Map(),
        positionByPlace: new Map(),
        displayedDriverTrips: new Set(),
        tripRequest: {
            origin: '',
            destination: ''
        }
    },
    mutations: {
        addTripProposals(state, tripProposalsByTrip){
            // BUG if there are drivers for the same trip in both tripProposalsByTrip and state.tripProposalsByTrip, only some are kept because they use the same key
            state.tripProposalsByTrip = new Map([...state.tripProposalsByTrip, ...tripProposalsByTrip])
        },
        addDirections(state, directionsByTrip){
            state.directionsByTrip = new Map([...state.directionsByTrip, ...directionsByTrip])
        },
        addPositions(state, positionByPlace){
            state.positionByPlace = new Map([...state.positionByPlace, ...positionByPlace])
        },
        setTripRequest(state, tripRequest){
            state.tripRequest = tripRequest
        },
        displayedDriverTrips: {
            add(state, trip){
                const newDisplayedDriverTrips = new Set(state.displayedDriverTrips)
                newDisplayedDriverTrips.add(trip)
                state.displayedDriverTrips = newDisplayedDriverTrips
            },
            delete(state, trip){
                const newDisplayedDriverTrips = new Set(state.displayedDriverTrips)
                newDisplayedDriverTrips.delete(trip)
                state.displayedDriverTrips = newDisplayedDriverTrips
            },
            clear(state){
                state.displayedDriverTrips = new Set()
            }
        }
    }
})

const actions = _actions(store)

function renderUI(store){
    const {tripProposalsByTrip, directionsByTrip, positionByPlace, tripRequest, displayedDriverTrips} = store.state
    //const {setTripRequest} = store.mutations
    const {setAndPrepareForTripRequest, toggleTripDisplay} = actions

    const proposedTrips = [...tripProposalsByTrip.keys()]

    const tripDetailsByTrip = computeTripDetails(proposedTrips, tripRequest, positionByPlace)

    render(
        html`<${Main} ...${ {
            tripProposalsByTrip, directionsByTrip, tripRequest, tripDetailsByTrip, displayedDriverTrips, positionByPlace,
            onTripRequestChange(tripRequest){ setAndPrepareForTripRequest(tripRequest) },
            onTripClick: toggleTripDisplay
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






json('/driver-trip-proposals')
.then(function cleanupDriverTripProposals(driverTripProposals){
    for(const driverTripProposal of driverTripProposals){
        driverTripProposal['Départ'] = driverTripProposal['Départ'].trim()
        driverTripProposal['Arrivée'] = driverTripProposal['Arrivée'].trim()
    }
    return driverTripProposals
})
.then(function driverTripProposalsToTripProposals(driverTripProposals){
    const tripProposalsByTrip = new Map()

    for(const driverTripProposal of driverTripProposals){
        const {
            Départ, Arrivée, Trajet, Jours, "Heure départ": HeureDépart, "Heure retour": HeureRetour,
            Adresse, Prénom, Nom, "N° de téléphone": tel, "Adresse e-mail": email, "Contact préféré": favContact
        } = driverTripProposal
        
        const driver = Object.freeze({ 
            Adresse, Prénom, Nom, "N° de téléphone": tel, "Adresse e-mail": email, "Contact préféré": favContact
        })

        const mainTrip = driverTripProposalToTrip(Départ, Arrivée);
        const mainTripProposals = tripProposalsByTrip.get(mainTrip) || []
        mainTripProposals.push({
            Départ,
            Arrivée,
            Trajet, 
            Jours, 
            "Heure départ": HeureDépart,
            driver
        })
        tripProposalsByTrip.set(mainTrip, mainTripProposals)

        const returnTrip = driverTripProposalToTrip(Arrivée, Départ);
        const returnTripProposals = tripProposalsByTrip.get(returnTrip) || []
        returnTripProposals.push({
            Départ: Arrivée,
            Arrivée: Départ,
            Trajet: undefined, // should be the reverse Trajet. Will this ever matter? 
            Jours, 
            "Heure départ": HeureRetour,
            driver
        })
        tripProposalsByTrip.set(returnTrip, returnTripProposals)
    }

    store.mutations.addTripProposals(tripProposalsByTrip)
})