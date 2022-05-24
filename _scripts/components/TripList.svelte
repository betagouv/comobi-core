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
            {#each tripList as tripProposal (tripProposal)}
                <SingleTrip {tripProposal} />
            {/each}
    </table>
{/if}

<style lang="scss">
/*@media (max-width: 48rem) {
    
}*/
.driver-list-table {
        thead {
            display: none;
        }
        tr {
            display: block;
        }
    }
@media only screen and (min-width: 48rem) {
	.driver-list-table {
		border-collapse: collapse;
		width: 100%;
		tr th {
            font-weight: 600;
            font-size: 0.8rem;
            line-height: 1rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            padding-left: 1rem;
            text-align: left;
		}
	}
}
</style>