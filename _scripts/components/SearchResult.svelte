<script>
	// @ts-check

	import TripList from './TripList.svelte'
	import { getAdditionnalTimeByTrip, getRelevantTrip }  from '../../server/findRelevantTripProposals.js'
	// @ts-nocheck
	import config from '../../_config.yml'

	/** @type {Map<Trip, TripProposal[]>} */
	export let tripProposalsByTrip
	/** @type {boolean} */
	export let validTripRequest
	/** @type {Trip} */
	export let tripRequest
	/** @type {Map<string, Position>} */
	export let positionByPlace

	/**
	 * @param {number} min
	 * @param {number} max
	*/
	const makeTimeFilter = (min, max) => {
		/**
		 * @param {number} time
		 */
		const timeFilter = time => time >= min && time < max
		return timeFilter
	}

	$: orderedTrips = getAdditionnalTimeByTrip(tripRequest, tripProposalsByTrip, positionByPlace)
	$: directTripList = getRelevantTrip(tripProposalsByTrip, orderedTrips, makeTimeFilter(0, 5))
	$: trip10List = getRelevantTrip(tripProposalsByTrip, orderedTrips, makeTimeFilter(5, 20))
	$: trip20List = getRelevantTrip(tripProposalsByTrip, orderedTrips, makeTimeFilter(20, 45))
	$: nbResult = directTripList.length + trip10List.length + trip20List.length
</script>

<style lang="scss">
	.invalidTripRequest {
		text-align: center;
		margin-top: 2rem;
		p {
			margin-bottom: 0rem
		}
	}
</style>

{#if !validTripRequest}
	<div class="invalidTripRequest">
		<p>
			{tripProposalsByTrip.size} trajets disponibles sur {config.nom}
		</p>
		<a href="{config.formulaire}">J'ai une voiture et je veux aider</a>
	</div>
{:else}
	<div class="search-result">
		{#if nbResult === 0}
			<h2>Aucun résultat</h2>
		{:else}
			{#if nbResult === 1}
				<h2>{nbResult} trajet disponible</h2>
			{:else}
				<h2>{nbResult} trajets disponibles</h2>
			{/if}
			{#if directTripList.length !== 0}
				<h3>Trajets directs</h3>
				<TripList tripList={directTripList} />
				{/if}
				{#if trip10List.length !== 0 || trip20List.length !== 0 }
					<h3>Trajets indirects</h3>
					{#if trip10List.length !== 0}
						<small>
							Un <em>détour de plus de 5 minutes</em> sera nécessaire pour vous récupérer :</small>
						<TripList tripList={trip10List}/>
					{/if}
					{#if trip20List !== undefined}
						<small>
							Un <em>détour conséquent (entre 20 et 45 minutes)</em> sera nécessaire pour vous récupérer :</small>
						<TripList tripList={trip20List}/>
					{/if}
			{/if}
		{/if}
	</div>
{/if}
