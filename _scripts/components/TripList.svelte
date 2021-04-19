<script>
    import SingleTrip from './SingleTrip.svelte'
    export let tripList
</script>

{#if tripList.length !== 0}
    <table class="driver-list-table">
        <thead>
            <tr>
                <th scope="col">dates</th>
                <th scope="col"></th>
                <th scope="col">départ</th>
                <th scope="col">arrivée</th>
                <th scope="col">place</th>
                <th scope="col">contacter</th>
            </tr>
        </thead>
        {#each tripList as tripProposal}
            <SingleTrip
				{tripProposal}
			/>
        {/each}
    </table>
{/if}