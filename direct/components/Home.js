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
	margin: 0.6rem auto;
`

const BoutonRechercher = ({ title = 'Rechercher un trajet' }) => html`
	<${Link} to="/recherche"><${Button('rgba(70, 130, 180, 1)')}>${title}<//><//>
`

const BoutonProposer = ({ title = 'Proposer mon trajet' }) => html`
	<a href="${instance.formulaire}"><${Button('#9fba93')}>${title}<//></a>
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
			width: 10rem;
			margin: 0 auto;
			display: block;
		}

		section {
			width: 100%;
            padding: 1rem calc( max(5px, ( 100vw - 50em ) / 2 ));
		}
		section a {
			display: block;
			margin: 0 auto;
		}
		section:first-child {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 6rem;
			width: 100%;
			max-width: 100%;
			position: relative;
			margin-top: 0;
			background: url("${instance.image}") no-repeat center center fixed;
		}
		@media (max-width: 800px){
		
		section:first-child {
		padding: 2rem;
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
			<h1><${NomService} /></h1>
			<p>${instance['sous-titre']}</p>
			<${styled.div`
				display: flex;
				flex-direction: row;
				a {
					margin: 0 1rem !important;
				}
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
			<img src=${require('./images/carte-france-macon.png')} />
		</section>
		<section>
			<h2>Passagers, recherchez un trajet en ligne</h2>
			<p>
				azur.comobi permet de réaliser tous les trajets du quotidien : école, sports, activités, loisirs, travail, crèche…. sur tout le bassin de vie et de déplacements autour de Valberg, depuis Puget-Théniers à Villars/Var en passant par Daluis. 
				Vous vous rendez sur la zone de Lingostière, à l’aéroport ou la gare SNCF de Nice, c’est possible aussi d’inscrire votre trajet. 
				C’est un service pour les habitants, animé par ses habitants !
			</p>
			<${BoutonRechercher} />
			<img src=${require('./images/calendrier.png')} />
		</section>
		<section>
			<h2>Conducteurs, vous avez un super-pouvoir</h2>
			<p>... Celui de partager vos trajets en voiture !</p>
			<${BoutonProposer} />
			<img src=${require('./images/hero.png')} />
		</section>
		<${FAQ} />
	<//>
`
