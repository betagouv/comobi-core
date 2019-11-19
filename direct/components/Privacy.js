import Overlay from './Overlay'
import React, { useState } from 'react'
import htm from 'htm'
import styled from 'styled-components'

const html = htm.bind(React.createElement)

export default function Privacy() {
	const [opened, setOpened] = useState(false)

	const handleClose = () => {
		setOpened(false)
	}
	const handleOpen = () => {
		setOpened(true)
	}

	return html`
		<a key="vie-privée" href="#" onClick=${handleOpen}>
			Vie privée
		</a>
		${opened &&
			html`
				<${Overlay} onClose=${handleClose} >
					<${PrivacyContent} />
				</${Overlay}>
			`}
	`
}

export let PrivacyContent = ({}) => html`<${React.Fragment}>
	<h1>Vie privée</h1>
	<p>
		Nous recueillons des statistiques anonymes sur l'utilisation du site, que
		nous utilisons dans le seul but d'améliorer le service, conformément
		aux${' '}
		<a
			href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience"
		>
			recommandations de la CNIL </a
		>et au règlement RGPD. Ce sont les seules données qui quittent votre
		navigateur.
	</p>
	<p>
		Vous pouvez vous soustraire de cette mesure d'utilisation du site
		ci-dessous.
	</p>
	<${styled.iframe`
		border: 0;
		height: 200px;
		width: 100%;
	`}
		src=${`https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut`}
	/>
	</${React.Fragment}>
`
