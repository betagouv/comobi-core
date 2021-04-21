<script>
  import { parse, format } from 'date-fns'
  
  export let tripProposal
  const getDate = (Jour) => {
    const date = parse(Jour, 'MM/dd/yyyy', new Date())
    const days = { E: format(date, 'E'), dMM : format(date, 'd LLL') }
    return { E: format(date, 'E'), dLLL : format(date, 'd LLL') }
  }
  const {
		Départ,
		Arrivée,
		Jours,
		Jour,
		heureDepart,
		driver: { Prénom, Nom, contact, lieu, modeContact }
	} = tripProposal
  
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
  <td class="place-number">
    <img alt="member" src="./images/icons/member.svg"/>
    <img alt="member" src="./images/icons/member.svg"/>
  </td>
  <td><button class="search-btn">Contacter {Prénom}</button></td>
</tr>

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
	.place-number {
		vertical-align: middle;
	}
  td {
    display: block;
		padding: 10px 15px;
	}
  td:before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
    padding-right: 0.5rem;
  }
}
@media screen and (min-width: 768px) {
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
