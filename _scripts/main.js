import { createElement } from 'react'
import { render } from 'react-dom'
import htm from 'htm'
import Store from 'baredux'
import { json } from 'd3-fetch'

import Main from './components/Main.js'

import { makeTrip } from '../geography/driverToTrip'
import computeTripDetails from '../geography/computeTripDetails'

import _actions from './actions.js'

const html = htm.bind(createElement)

// describe store
const store = new Store({
	state: {
		/* tripProposalsByTrip: A map with (origin, destination) object as key and tripProposal list as value
		corresponding to this (origin, destination) object */
		tripProposalsByTrip: new Map(),
		positionByPlace: new Map(),
		tripRequest: {
			origin: '',
			destination: ''
		},
		validPlaceNames: []
	},
	mutations: {
		addTripProposals(state, tripProposalsByTrip) {
			// BUG if there are drivers for the same trip in both tripProposalsByTrip and state.tripProposalsByTrip, only some are kept because they use the same key
			state.tripProposalsByTrip = new Map([
				...state.tripProposalsByTrip,
				...tripProposalsByTrip
			])
		},
		addPositions(state, positionByPlace) {
			state.positionByPlace = new Map([
				...state.positionByPlace,
				...positionByPlace
			])
		},
		setTripRequest(state, tripRequest) {
			state.tripRequest = tripRequest
		},
		setValidPlaceNames(state, validPlaceNames) {
			state.validPlaceNames = validPlaceNames
		}
	}
})

const actions = _actions(store)

function renderUI(store) {
	const {
		tripProposalsByTrip,
		positionByPlace,
		tripRequest,
		validPlaceNames
	} = store.state
	//const {setTripRequest} = store.mutations
	const { setAndPrepareForTripRequest, toggleTripDisplay } = actions

	const proposedTrips = [...tripProposalsByTrip.keys()]

	const tripDetailsByTrip = computeTripDetails(
		proposedTrips,
		tripRequest,
		positionByPlace
	)

	render(
		html`
			<${Main}
				...${{
				tripProposalsByTrip,
				tripRequest,
				tripDetailsByTrip,
				positionByPlace,
				validPlaceNames,
				onTripRequestChange(tripRequest) {
					setAndPrepareForTripRequest(tripRequest)
				},
			}}
			/>
		`,
		document.querySelector('.react-component')
	)
}

// add a listener: when the state is modified renderUI is called
store.subscribe(state => {
	renderUI(store)
})

// initial render
renderUI(store)

// call server and initialize state tripProposals list
json(`/driver-trip-proposals`).then(tripProposals => {
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
})

// call server and initialize state validPlaceName
json(`/valid-place-names`).then(store.mutations.setValidPlaceNames)

