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
    <td class="datetime">{Jours}</td>
  {:else}
    <td class="date">
      {#if Jour !== ''} 
        <span class="light">{getDate(Jour).E}</span>
        <span>{getDate(Jour).dLLL}</span>
      {/if}
    </td>
  {/if}
  {#if heureDepart !== '-'} 
    <td class="light">{heureDepart}</td>
  {/if}
  <td>{Départ}</td>
  <td>{Arrivée}</td>
  <td class="place-number">
    <img alt="member" src="./images/icons/member.svg"/>
    <img alt="member" src="./images/icons/member.svg"/>
  </td>
  <td><button class="search-btn">Contacter {Prénom}</button></td>
</tr>
