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
            class="laptop-icon" 
            src="./images/icons/double-arrow.svg"
            on:click={reverseClicked}
        />
        <CityInput
            label="Arrivée"
            validPlaceNames={validPlaceNames}
            bind:value={destination}
        />
        <button class="search-btn" type="submit">Rechercher</button>
    </div>
    <img 
        alt="arrow"
        class="mobile-icon" 
        src="./images/icons/double-arrow.svg"
        on:click={reverseClicked}
    />  
</form>

<style lang="scss">
.search-form {
	display: flex;
	flex-direction: row;
	background-color: white;
	padding: 10px;
	border: 1px solid rgba(50, 66, 124, 0.05);
	box-shadow: 0px 3px 3px rgba(211, 211, 211, 0.15);
	border-radius: 4px;
    transform: translateY(-3em);
	.input-list {
		display: flex;
		flex: 10;
		flex-direction: column;
	}
	.mobile-icon {
		display: flex;
	}
	.laptop-icon {
		display: none;
	}
	img {
		display: flex;
		flex: 1;
		align-self: self-start;
		margin-top: 34px !important;
		width: 24px;
		height: 24px;
		margin-top: 16px;
	}
	.search-btn {
		width: min-content;
        display: flex;
        flex: 1;
        padding: 10px;
        margin-left: 0.5rem;
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
        .laptop-icon {
            display: flex;
        }
        .mobile-icon {
            display: none;
        }
    }
}
</style>