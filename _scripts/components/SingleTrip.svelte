<script>
  import { parse, format } from 'date-fns'
  import { fr } from 'date-fns/locale'
  import Modal from './Modal.svelte'
  
  /** @type {TripProposal} */
  export let tripProposal
  const getDate = (Jour) => {
    const date = parse(Jour, 'dd/MM/yyyy', new Date())
    return { E: format(date, 'E', { locale: fr }), dLLL : format(date, 'd LLL', { locale: fr }) }
  }
  const {
		Départ,
		Arrivée,
		Jours,
		Jour,
		heureDepart,
		driver: { Prénom, Nom, contact, modeContact }
	} = tripProposal

  let modal;
  
</script>

<tr class="inline-trip">
  {#if Jours !== ''}
    <td class="datetime" data-label="date">{Jours}</td>
  {:else}
    <td class="date" data-label="date">
      {#if Jour !== ''} 
        <span class="light">{getDate(Jour).E}</span>
        <span>{getDate(Jour).dLLL}</span>
      {/if}
    </td>
  {/if}
  {#if heureDepart !== '-'} 
    <td class="light" data-label="heure">{heureDepart}</td>
  {/if}
  <td data-label="départ">{Départ} </td>
  <td data-label="arrivée">{Arrivée}</td>
  <!--<td class="place-number">
    <img alt="member" src="./generic-images/icons/member.svg"/>
    <img alt="member" src="./generic-images/icons/member.svg"/>
  </td>-->
  <td><button class="search-btn" on:click={() => modal.show()}>Contacter {Prénom}</button></td>
</tr>
<Modal bind:this={modal}>
  <h3>{Prénom} {Nom}</h3>
  {#if modeContact === 'Email'}
    <a href="mailto:{contact}">{contact}</a>
  {:else}
    <a href="tel:{contact}">{contact}</a>
    <p>Moyen de contact préfére : <br/>
      > {modeContact}
    </p>
  {/if}
</Modal>

<style lang="scss">
.inline-trip {
	padding: 10px;
	background: #FFFFFF;
	box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.06);
	font-style: normal;
	font-weight: 600;
	font-size: 15px;
	line-height: 19px;
	color: #282828;
	.light {
		font-weight: normal;
	}
	/*.place-number {
		vertical-align: middle;
	}*/
  td {
    display: block;
		padding: 10px 15px;
    text-transform: capitalize;
	}
  td:before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
    padding-right: 0.5rem;
  }
}
@media screen and (min-width: 48rem) {
  .inline-trip {
    td {
      display: table-cell;
    }
    td:before {
    content: none;
    }
  }
}
</style>
