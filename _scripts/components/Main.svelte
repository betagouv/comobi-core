<script>
	import TripSelection from './TripSelection.svelte'
	export let tripProposalsByTrip;
	export let tripRequest;
	export let positionByPlace;
	export let validPlaceNames;
	export let onTripRequestChange;
</script>

<!-- TODO: utiliser pagejs pour le routage -->
<main>
	<div>
		<TripSelection
			{tripProposalsByTrip}
			{tripRequest}
			{validPlaceNames}
			{positionByPlace}
			{onTripRequestChange}
		/>
	</div>
</main>

<style>
	main {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	div {
		flex-grow: 1;
	}
</style>