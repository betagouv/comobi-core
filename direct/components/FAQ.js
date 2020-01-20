import React from 'react'
import htm from 'htm'
const html = htm.bind(React.createElement)
import { Description, NomService } from './Home'
import { Link } from 'react-router-dom'

export default function FAQ() {
	return html`
		<div>
			<h2>Questions fréquentes</h2>
			<ul>
				<li>
					<h3>Est-ce qu'il faut payer ?</h3>
					<p>
						Pour les covoiturages ponctuels, nous demandons aux conducteurs de
						les faire gratuitement. Pour les covoiturages réguliers, c'est à
						décider entre le conducteur et le passager. <${NomService} /> ne
						touche aucune rémunération.
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
					<h3>
						Qu'est-ce que c'est, Macon Voit'Emploi ?
					</h3>

					<p>
						<${Description} />
					</p>
				</li>
			</ul>
		</div>
	`
}
