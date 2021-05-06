<script>
    import CityInput from './CityInput.svelte'

    export let tripRequest
    export let validPlaceNames
    export let onTripRequestChange

    let origin = tripRequest.origin
    let destination = tripRequest.destination

    const reverseClicked = () => {
        [destination, origin] = [origin, destination]
    }

    const onSubmit = (e) => {
        e.preventDefault()
        onTripRequestChange({ origin, destination })
    }
</script>

<form key="form" class="search-form" on:submit={onSubmit}>
    <div class="input-list">
        <CityInput
            label="Départ"
            validPlaceNames={validPlaceNames}
            bind:value={origin}
        />
        <img 
            alt="arrow"
            class="icon" 
            src="./generic-images/icons/double-arrow.svg"
            width="25px"
            height="25px"
            on:click={reverseClicked}
        />
        <CityInput
            label="Arrivée"
            validPlaceNames={validPlaceNames}
            bind:value={destination}
        />
        <button class="search-btn" type="submit">Rechercher</button>
    </div> 
</form>

<style lang="scss">
.search-form {
	display: flex;
	flex-direction: row;
	background-color: white;
	padding: 1rem 2rem;
	border: 1px solid rgba(50, 66, 124, 0.05);
	box-shadow: 0px 3px 3px rgba(211, 211, 211, 0.15);
	border-radius: 4px;
    transform: translateY(-3em);
	.input-list {
		display: flex;
		flex: 10;
		flex-direction: column;
	}

	img {
        align-self: center;
        transform: rotate(90deg);
        @media only screen and (min-width: 48rem) {
            transform: none;
            margin: 0 1.5rem;
        }
	}
	.search-btn {
        padding: 10px;
        @media only screen and (min-width: 48rem) {
            margin-left: 0.5rem;
        }
	}
}
@media only screen and (min-width: 48rem) {
    .search-form {
        background-color: white;
        max-width: 50rem;
        .input-list {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
    }
}
</style>