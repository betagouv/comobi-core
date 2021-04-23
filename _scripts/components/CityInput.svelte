<script>
    import escapeRegexp from 'escape-string-regexp'
    import config from '../../_config.yml'

    export let label
    export let validPlaceNames
    export let value

    const validation = config.liste_ville_restreinte !== undefined && config.liste_ville_restreinte.toLowerCase() === 'oui'
    
    let validationMessage
    $: validationMessage = `Vous devez saisir un de ces lieux : ${validPlaceNames.join(', ')}`
    const datalistId = 'valid-place-names'
    
    let pattern
    $: pattern = validation ? validPlaceNames.map(s => escapeRegexp(s)).join('|') : undefined
</script>

<label class="search-input">
    <datalist id={datalistId}>
        {#each validPlaceNames as validPlaceName}
            <option value={validPlaceName} />
        {/each}
    </datalist>
    <strong>{label}</strong>
    <input
        class="city-input"
        type="text"
        list={datalistId}
        bind:value
        on:change={e => {e.target.setCustomValidity('')}}
        pattern={validation ? pattern : undefined}
        on:invalid={validation ? e => {
            e.target.setCustomValidity(validationMessage)
        } : undefined}
        on:blur={validation ? e => {
            e.target.checkValidity() // this triggers an 'invalid' event if input is invalid
        } : undefined}
    />
</label>

<style>
.city-input {
	border: 1px solid #E6E6E6;
	box-sizing: border-box;
	border-radius: 5px;
}
.search-input {
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 10px;
}
</style>
