import styled from 'styled-components'

const ButtonStyle = `
	margin: 0.4rem auto 0.2rem;
	padding: 0.1rem 0.4rem;
	display: block;
	text-align: center;
	cursor: pointer;
	border-radius: 0.3rem;
`
export const SimpleButton = styled.button`
	${ButtonStyle}
	background: none;
	border: 1px solid black;
`
export const ContactLinkButton = styled.a`
	${ButtonStyle}
	background: rgba(147, 196, 125, 1);
	color: white;
	width: 14rem;
`
