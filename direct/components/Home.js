import React from 'react'
import htm from 'htm'
const html = htm.bind(React.createElement)
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Button = color => styled.button`
	background: ${color};
	border: none;
	color: white;
	padding: 0.6rem 1rem;
`

export default () => html`
	<div>
		<h1>Covoiturez dans votre département !</h1>
		<${Link} to="/recherche"
			><${Button('rgba(70, 130, 180, 1)')}>Rechercher un trajet<//><//
		>
		<${Link} to="/inscription"><${Button('#9fba93')}>Proposer mon trajet<//><//>
	</div>
`
