import React from 'react'
import htm from 'htm'
const html = htm.bind(React.createElement)
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Container from './Inscription'
const instance = require(`../../instances/${INSTANCE}.yaml`)
import FAQ from './FAQ.js'

export const NomService = () => html`
	<span>${instance.nom}</span>
`

export const Button = color => styled.button`
	display: block;
	background: ${color};
	border: none;
	color: white;
	padding: 0.6rem 1rem;
	margin: 0 5px;
`

const BoutonRechercher = ({ title = 'Rechercher un trajet' }) => html`
	<${styled.a`
		display: flex;
		justify-content: center;
	`} href="/recherche"><${Button('#199bb0')}>${title}<//><//>
`

const BoutonProposer = ({ title = 'Proposer mon trajet' }) => html`
	<${styled.a`
		display: flex;
		justify-content: center;
	`} href="${instance.formulaire}"><${Button('#22aa75')}>${title}<//><//>
`

export default () => html`
	<${styled.div`
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-top: 0;
		h1 {
			text-decoration: none;
			font-size: 250%;
		}

		img {
			width: 100%;
			margin: 0 auto;
			display: block;
			object-fit: contain;
		}

		section {
			width: 100%;
            padding: 1rem calc( max(5px, ( 100vw - 50em ) / 2 ));
		}
		section a {
			margin: 0.5rem auto;
		}
		section:first-child {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			max-width: 100%;
			position: relative;
			margin-top: 0;
			background-color: #b8e4e7;
		}
		@media (max-width: 800px){
		
			section:first-child {
				padding: 1rem 0;
			}
		}

		section:first-child p, section:first-child h1 {
			padding: 0 1.3rem;
			background: white;
		}
		section:first-child p {
			text-align: center;
			font-size: 130%;
		}
		section:first-child img {
			width: 100%;
		}
	`}>
		<section>
			<${styled.div`
				display: flex;
				flex-direction: row;
				justify-content: space-evenly;
				width: 100%;
			`}>
				<${BoutonRechercher} />
				<${BoutonProposer} />
			<//>
		</section>
		<section>
			<h2>${instance.slogan}</h2>
			<p>
				${instance.description}
			</p>
			<img src=${require('./images/plan comobi-sans illus.png')} />
		</section>
		<section>
			<h2>Passagers, recherchez un trajet en ligne</h2>
			<p>
				azur.comobi permet de réaliser tous les trajets du quotidien : école, sports, activités, loisirs, travail, crèche…. sur tout le bassin de vie et de déplacements autour de Valberg, depuis Puget-Théniers à Villars/Var en passant par Daluis. 
				Vous vous rendez sur la zone de Lingostière, à l’aéroport ou la gare SNCF de Nice, c’est possible aussi d’inscrire votre trajet. 
				C’est un service pour les habitants, animé par ses habitants !
			</p>
			<${BoutonRechercher} />
			<img src=${require('./images/calendrier.png')} height="100px"/>
		</section>
		<section>
			<h2>Conducteurs, vous avez un super-pouvoir</h2>
			<p>... Celui de partager vos trajets en voiture !</p>
			<${BoutonProposer} />
			<img src=${require('./images/Logo azurcomobi-vertical.png')} height="100px"/>
		</section>
		<${FAQ} />
	<//>
`
