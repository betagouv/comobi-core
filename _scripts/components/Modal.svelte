<script>
    let shown = false
    export function show() {
        shown = true
    }
    export function hide() {
        shown = false
    }
</script>

<svelte:window 
    on:keydown={(e) => {
        if(e.key === 'Enter' || e.key === 'Escape') {
            hide()
        }
    }}
/> 

{#if shown}
    <div class="modal-wrapper" on:click={() => hide()}>
        <div class="modal">
            <span class="close" on:click={() => hide()}>&times;</span>
            <slot/>
        </div>
    </div>
{/if}

<style>
.modal-wrapper {
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.modal {
    background-color: white;
    max-width: max-content;
    padding: 1rem;
    margin: 15% auto;
    border-radius: 10px;
}
.close {
    float: right;
    cursor: pointer;
    font-size: 2rem;
    line-height: 1.5rem;
}
.close:hover {
    font-weight: bold;
}
</style>

