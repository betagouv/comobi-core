<script>
    import CityInput from './CityInput.svelte'

    export let tripRequest
    export let validPlaceNames
    export let onTripRequestChange

    console.log('search component ', validPlaceNames)

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
        <div class="search-input">
            <button class="search-btn" type="submit">Rechercher</button>
        </div>
    </div>
    <img 
        alt="arrow"
        class="mobile-icon" 
        src="./images/icons/double-arrow.svg"
        on:click={reverseClicked}
    />  
</form>