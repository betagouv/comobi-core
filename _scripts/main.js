import Main from './components/Main.svelte'
import page from 'page'
import Store from 'baredux'
import _actions from './actions.js'
import { json } from 'd3-fetch'
import { makeTrip } from '../geography/driverToTrip'

/** @type {State} */
const state = {
	tripProposalsByTrip: new Map(),
	positionByPlace: new Map(),
	tripRequest: {
		origin: '',
		destination: ''
	},
	validPlaceNames: []
}


// Store Mutations
/**
 * @param {State} state
 * @param {Map<Trip, TripProposal>} tripProposalsByTrip
 */
 function addTripProposals(state, tripProposalsByTrip) {
	state.tripProposalsByTrip = new Map([
		...state.tripProposalsByTrip,
		...tripProposalsByTrip
	])
}

/**
 * @param {State} state 
 * @param {Map<string, Position>} positionByPlace 
 */
function addPositions(state, positionByPlace) {
	state.positionByPlace = new Map([
		...state.positionByPlace,
		...positionByPlace
	])
}

/**
 * 
 * @param {State} state 
 * @param {Trip} tripRequest 
 */
function setTripRequest(state, tripRequest) {
	state.tripRequest = tripRequest
}

/**
 * 
 * @param {State} state 
 * @param {string[]} validPlaceNames 
 */
function setValidPlaceNames(state, validPlaceNames) {
	state.validPlaceNames = validPlaceNames
}

/** @type {Store} */
const storeObject = {
	state,
	mutations: {
		addTripProposals,
		addPositions,
		setTripRequest,
		setValidPlaceNames,
	}
}

// @ts-ignore
const store = new Store(storeObject)
const actions = _actions(store)

const svelteTarget = document.querySelector('.svelte-main')

let currentComponent;
let mapStateToProps = () => {};

function replaceComponent(newComponent, _mapStateToProps){
    if(!_mapStateToProps){
        throw new Error('Missing _mapStateToProps in replaceComponent')
    }

    if(currentComponent)
        currentComponent.$destroy()
    
    currentComponent = newComponent
    mapStateToProps = _mapStateToProps
}

function render(state){
    const props = mapStateToProps(state);
	currentComponent.$set(props)
}

store.subscribe(render)

// Initialize State
/**
 * @param {TripProposal[]} tripProposals 
 */
 const getTripProposals = (tripProposals) => {
	const tripProposalsByTrip = new Map()
	// a trip proposal is an object with trip and driver infos
	for (const tripProposal of tripProposals) {
		// create a trip: a object with origin and destination
		const trip = makeTrip(tripProposal.Départ, tripProposal.Arrivée)
		// list of trip with same origin and destination
		const currentEntries = tripProposalsByTrip.get(trip) || []

		// add the current tripProposal in the list
		currentEntries.push(tripProposal)
		tripProposalsByTrip.set(trip, currentEntries)
	}
	// add the tripProposalsByTrip map in the store
	store.mutations.addTripProposals(tripProposalsByTrip)
}

// call server and initialize state tripProposals list
// @ts-ignore
json(`/driver-trip-proposals`).then(tripProposals => getTripProposals(tripProposals))

// call server and initialize state validPlaceName
json(`/valid-place-names`).then(store.mutations.setValidPlaceNames)


// Router
page('/', _ => {
	function mapStateToProps(state){
		const {
			tripProposalsByTrip,
			positionByPlace,
			tripRequest,
			validPlaceNames
		} = store.state

		const { setAndPrepareForTripRequest } = actions
		return {
			tripProposalsByTrip, 
			tripRequest,
			validPlaceNames,
			positionByPlace,
			onTripRequestChange(tripRequest) {
				setAndPrepareForTripRequest(tripRequest)
			}
		}
	}
	const ressource = new Main({
        target: svelteTarget,
        props: mapStateToProps(store.state)
    });
    replaceComponent(ressource, mapStateToProps)
})

page.start()