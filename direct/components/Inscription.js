import React, { useState } from 'react'
import htm from 'htm'
import { Button } from './Home'
const html = htm.bind(React.createElement)
import styled from 'styled-components'

export const Container = styled.div`
	max-width: 35rem;
	margin: 0 auto;
	background: #eef3ea;
	padding: 1rem 3rem;
	> label {
		background: white;
		padding: 1rem;
		border-radius: 0.3rem;
		margin-bottom: 1rem;
	}
	input {
		margin-top: 1rem;
	}
`

export default () => {
	const [data, setData] = useState({ départ: 'Rennes', arrivée: 'Nantes' })

	let set = (key, value) => setData({ ...data, [key]: value })
	return html`
		<${Container}>
			<h1>Inscription conducteur</h1>
			<p>
				Proposez ici votre trajet ponctuel ou régulier. Vous pouvez consulter
				les${' '}
				<a href="http://bit.ly/CG-Lotocar"
					>Conditions Générales d'Utilisation du Service applicables</a
				>
			</p>
			<label
				>De quelle commune partez-vous ?
				<input
					value=${data.départ}
					onChange=${e => set('départ', e.target.value)}
			/></label>
			<label
				>Dans quelle commune arrivez-vous ?
				<small
					>Merci de n'inscrire qu'un seul point de destination, si vous faites
					d'autres trajets, vous pouvez remplir ce formulaire plusieurs
					fois.</small
				>

				<input
					value=${data.arrivée}
					onChange=${e => set('arrivée', e.target.value)}
			/></label>
			<label
				>Où plus précisément ? Entreprise, club de sport, quartier, etc.<input
			/></label>
			<label>Par quelles communes passez-vous ?<input /></label>
			<label
				>Si vous faites ce trajet de manière régulière, quels jours de la
				semaine le faites-vous ? <${DaysInput}><//
			></label>
			<label>
				Si vous ne proposez ce trajet qu'une fois, à quelle date a-t-il lieu ?
				<input type="date"
			/></label>
			<label>A quelle heure partez-vous ? <input type="time"/></label>
			<label
				>A quelle heure prenez-vous le chemin du retour ? <input type="time"
			/></label>
			<label
				>Pour quel(s) type(s) de covoiturage êtes-vous disponible ?
				<label
					><input type="checkbox" name="régulier" />Le covoiturage régulier
					(partage des frais à définir avec le passager, ou alternance de
					véhicule etc.)</label
				>
				<label
					><input type="checkbox" name="ponctuel" />Le covoiturage ponctuel et
					gratuit, pour rendre service à une personne de temps en temps
					(recommandé par Lotocar)</label
				>
			</label>

			<${Button('#9fba93')}
				onClick=${() =>
					fetch('/inscription', { method: 'POST' })
						.then(res => res.json())
						.then(res => console.log('did save', res))}
				>Proposer ce trajet<//
			>
		<//>
	`
}

const DaysInput = () => {
	const days = [
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Samedi',
		'Dimanche'
	]
	return days.map(
		day => html`
			<div>
				<label>
					<input type="checkbox" name=${day} />
					${day}</label
				>
			</div>
		`
	)
}
