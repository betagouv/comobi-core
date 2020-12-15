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
						Le prix : gratuit, mais vous pouvez aussi vous arranger avec votre conducteur si vos trajets sont réguliers. 
						Le service ${NomService} lui reste gratuit, pas d’échange d’argent via le site, c’est un service public accessible à tous !
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
						Comment ça se passe côté assurances et en cas d'accident pendant
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
					<h3>Qu'en est-il de la protection des données personnelles ?</h3>
					<p>
						Les seules données collectées sont celles fournies par les conducteurs et conductrices.
						Ces données sont utilisées uniquement pour la mise en relation avec les passager·ère·s.
						Pour toute modification ou suppression, vous pouvez contacter <a href="mailto:mdjenaihi@valberg.com">Maureen DJENAIHI</a>.
					</p>
				</li>
				<li>
					<h3>Et en période de COVID ?</h3>

					<p>
						Le site est fonctionnel et les trajets possibles en période de renforcement des
						mesures sanitaires. Nous appelons à la responsabilité des passagers et
						conducteurs pour respecter les gestes barrières et recommandations
						disponibles <a href="https://www.gouvernement.fr/sites/default/files/affiche_gestes_barrieres_covoiturage_a4.pdf">ici</a>.
					</p>
				</li>
			</ul>
		</section>
	`
}
