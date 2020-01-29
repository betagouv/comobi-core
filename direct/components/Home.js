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
export const Description = () => html`
	<span>${instance.description}</span>
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
			max-width: 45rem;
			padding: 0 1rem;
			margin: 2rem 0;
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
				<${NomService} /> met en relation des conducteurs réguliers avec des
				passagers qui s'adaptent à leurs trajet et horaires. Que ça soit une
				seule fois ou de manière régulière !
			</p>
			<p><${NomService} /> = entraide + économies + écologie !</p>
			<img src=${require('./images/carte-france-macon.png')} />
		</section>
		<section>
			<h2>Passagers, recherchez un trajet en ligne</h2>
			<p>
				Vous souhaitez vous rendre à un entretien d’embauche ? A une formation
				ou un nouvel emploi ?
			</p>
			<p>
				Vous pouvez rechercher un conducteur en ligne et le contacter
				directement !
			</p>

			<${BoutonRechercher} />
			<img src=${require('./images/calendrier.png')} />
		</section>
		<section>
			<h2>Conducteurs, vous avez un super-pouvoir</h2>
			<p>... Celui de partager vos trajets en voiture !</p>
			<p>
				Indiquez vos lieux de départ, d'arrivée et horaires habituels : pas de
				détour à faire ! Covoiturage régulier et/ou ponctuel : c'est vous qui
				choisissez.
			</p>

			<${BoutonProposer} />
			<img src=${require('./images/hero.png')} />
		</section>
		<section>
			<h2>Nous avons besoin de vous !</h2>
			<p>
				Vous avez une voiture et l'envie de partager ? Vous recherchez des
				solutions pour vous déplacer ? Nous avons besoin de vous pour faire
				grandir Mâcon Voit'Emploi !
			</p>

			<${styled.div`
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				> div {
					margin: 1rem;
				}
			`}
			>
				<div>
					<img src=${require('./images/voiture.png')} />
					<${BoutonProposer} title="Je me déclare conducteur !" />
				</div>
				<div>
					<img src=${require('./images/passager.png')} />
					<${BoutonRechercher} title="Je recherche un trajet !" />
				</div>
			</div>
		</section>
		<${FAQ} />
	<//>
`
