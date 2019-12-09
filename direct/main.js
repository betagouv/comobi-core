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

const store = new Store({
	state: {
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
		setValidPlaceNames(state, validPlaceNames){
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
					onTripClick: toggleTripDisplay
				}}
			/>
		`,
		document.body
	)
}

store.subscribe(state => {
	renderUI(store)
})

console.log(store.state)

// initial render
renderUI(store)

json('/driver-trip-proposals').then(tripProposals => {
	const tripProposalsByTrip = new Map()

	for (const tripProposal of tripProposals) {
		const trip = makeTrip(tripProposal.Départ, tripProposal.Arrivée)
		const currentEntries = tripProposalsByTrip.get(trip) || []

		currentEntries.push(tripProposal)
		tripProposalsByTrip.set(trip, currentEntries)
	}
	store.mutations.addTripProposals(tripProposalsByTrip)
})

json('/valid-place-names').then(store.mutations.setValidPlaceNames)