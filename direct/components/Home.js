import React from 'react'
import htm from 'htm'
const html = htm.bind(React.createElement)
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Container from './Inscription'

export const Button = color => styled.button`
	display: block;
	background: ${color};
	border: none;
	color: white;
	padding: 0.6rem 1rem;
	margin: 0.3rem;
`
const Image = styled.img`
	height: 20vh;
	display: block;
	margin: 1rem;
`

export default () => html`
	<${styled.div`
		max-width: 35rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		flex-direction: column;
	`}>
		<h1>Covoiturez dans votre département !</h1>
		<${Image}
			src="https://images.unsplash.com/photo-1543609323-3a20e86976de?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
		/>
		<${Link} to="/recherche"
			><${Button('rgba(70, 130, 180, 1)')}>Rechercher un trajet<//><//
		>
		<${Link} to="/inscription"><${Button('#9fba93')}>Proposer mon trajet<//><//>
	<//>
`
