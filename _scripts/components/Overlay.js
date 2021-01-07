import FocusTrap from 'focus-trap-react'
import React, { useEffect } from 'react'
import htm from 'htm'
import styled from 'styled-components'

const html = htm.bind(React.createElement)

export default function Overlay({ onClose, children }) {
	return html`
		<${styled.div`
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(255, 255, 255, 0.9);
			overflow: auto;
			z-index: 1;
			color: initial;
			#overlayContent {
				position: absolute;
				padding-bottom: 1rem;
				min-height: 6em;

				box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
					0 1px 2px rgba(41, 117, 209, 0.24);
				padding-left: 1rem;
				padding-right: 1rem;
				background: white;
				will-change: transform;
				user-select: text;
				border-radius: 0.3rem;
				transition: box-shadow 0.2s;
			}
			#overlayCloseButton {
				position: absolute;
				top: 0rem;
				text-decoration: none;
				font-size: 200%;
				color: rgba(51, 51, 80, 0.8);
				right: 0.5rem;
			}
			@media (min-width: 600px) {
				#overlayContent {
					transform: translateX(-50%);
					top: 100px;
					left: 50%;
					width: 80%;
					max-width: 40em;
				}
			}
		`} id="overlayWrapper">
			<${FocusTrap}
				focusTrapOptions=${{
					onDeactivate: onClose,
					clickOutsideDeactivates: !!onClose
				}}>
				<div
					aria-modal="true"
					id="overlayContent">
					${onClose &&
						html`
							<a
								aria-label="close"
								href="#"
								onClick=${onClose}
								id="overlayCloseButton"
							>
								×
							</a>
						`}
					${children}
				</div>
			</${FocusTrap}>
		</div>
	`
}
