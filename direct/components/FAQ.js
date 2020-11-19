import React from 'react'
import htm from 'htm'
import styled from 'styled-components'
const html = htm.bind(React.createElement)
import { Description, NomService } from './Home'
import { Link } from 'react-router-dom'

export default function FAQ() {
	return html`
		<${styled.section`
			background-color: #ecf0f1;
			p a {
				display: inline;
			}
		`}>
			<h2>Questions fréquentes</h2>
			<ul>
				<li>
					<h3>Est-ce qu'il faut payer ?</h3>
					<p>
						Pour les covoiturages ponctuels, nous demandons aux conducteurs de
						les faire gratuitement. Pour les covoiturages réguliers, c'est à
						décider entre le conducteur et le passager. <${NomService} /> ne
						touche aucune rémunération.
						et le prix : gratuit, mais vous pouvez aussi vous arranger avec 
						votre conducteur si vos trajets sont réguliers. 
						Le service <${NomService} /> lui reste gratuit, pas d’échange d’argent via le site, 
						c’est un service public accessible à tous !
					</p>
				</li>
				<li>
					<h3>
						Faut-il faire l'aller et le retour ensemble ?
					</h3>

					<p>
						Non, sauf si ça arrange tout le monde. Un passager peut faire
						l'aller et le retour avec des conducteurs différents.
					</p>
				</li>
				<li>
					<h3>
						Est-ce que je peux contacter directement les conducteurs qui
						m'intéressent ?
					</h3>

					<p>
						Oui, en cliquant <${Link} to="/recherche">ici <//>vous pouvez
						rechercher un trajet dans notre base de conducteurs inscrits.
					</p>
				</li>
				<li>
					<h3>
						Comment ça se passe côté assurances et s'il y a un accident pendant
						le covoiturage ?
					</h3>

					<p>
						L'assurance responsabilité civile du conducteur (comprise dans
						l'assurance auto) couvre les passagers et les indemnise en cas
						d'accident. Le conducteur doit prévenir son assureur qu'il pratique
						le covoiturage et s'assurer que les trajets domicile-travail sont
						bien couverts.
					</p>
				</li>
				<li>
					<h3>SECTION COVID</h3>

					<p>
						DESCRIPTION COVID
					</p>
				</li>
			</ul>
		</section>
	`
}
