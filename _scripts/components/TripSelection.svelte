<script>
	import SearchComponent from './SearchComponent.svelte'
	import SearchResult from './SearchResult.svelte'
	import { ASYNC_STATUS } from '../asyncStatusHelpers'
	export let tripProposalsByTrip;
	export let tripRequest;
	export let positionByPlace;
	export let validPlaceNames;
	export let onTripRequestChange;
</script>

<section class="trip-selection">
	<SearchComponent
		tripRequest=${tripRequest}
		validPlaceNames=${validPlaceNames}
		onTripRequestChange=${onTripRequestChange}
	/>
	<SearchResult
		tripProposalsByTrip=${tripProposalsByTrip}
		tripRequestAsyncStatus=${tripRequest[ASYNC_STATUS]}
		validTripRequest=${tripRequest.destination !== '' &&
tripRequest.origin !== ''}
		tripRequest=${tripRequest}
		positionByPlace=${positionByPlace}
	/>
</section>