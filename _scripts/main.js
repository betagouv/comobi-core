// @ts-check
import '../helpers/typedef.js'
import { createElement } from 'react'
import { render } from 'react-dom'
import htm from 'htm'
import Store from 'baredux'
import { json } from 'd3-fetch'

import Main from './components/Main.js'

import { makeTrip } from '../geography/driverToTrip'

import _actions from './actions.js'

const html = htm.bind(createElement)

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

/**
 * @param {Store} store 
 */
function renderUI(store) {
	const {
		tripProposalsByTrip,
		positionByPlace,
		tripRequest,
		validPlaceNames
	} = store.state

	const { setAndPrepareForTripRequest } = actions
	const app = html`
		<${Main}
			...${{
			tripProposalsByTrip,
			tripRequest,
			positionByPlace,
			validPlaceNames,
			onTripRequestChange(tripRequest) {
				setAndPrepareForTripRequest(tripRequest)
			},
		}}
		/>
	`
	render(app,document.querySelector('.react-component'))
}

// add a listener: when the state is modified renderUI is called
store.subscribe(state => {
	renderUI(store)
})

// initial render
renderUI(store)

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

