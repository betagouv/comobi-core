<script>
	import SearchComponent from './SearchComponent.svelte'
	import SearchResult from './SearchResult.svelte'
	export let tripRequest
	export let positionByPlace
	export let validPlaceNames
	export let onTripRequestChange
	export let tripProposalsByTrip
</script>

<section class="trip-selection">
	<SearchComponent
		tripRequest={tripRequest}
		validPlaceNames={validPlaceNames}
		onTripRequestChange={onTripRequestChange}
	/>
	<SearchResult
		tripProposalsByTrip={tripProposalsByTrip}
		validTripRequest={tripRequest.destination !== '' &&
tripRequest.origin !== ''}
		tripRequest={tripRequest}
		positionByPlace={positionByPlace}
	/>
</section>