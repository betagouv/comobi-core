import { google } from 'googleapis'

const googleAPIKey = process.env.GOOGLE_API_KEY
const googleDriverSpreadsheetId = process.env.GOOGLE_DRIVER_SPREADSHEET_ID

const sheets = google.sheets({ version: 'v4', auth: googleAPIKey })

// This header was used in the first instance for the LOT department
const LEGACY_CONDUCTEUR_PROPS = [
	'Date',
	'Départ',
	'Adresse',
	'Actif ou Retraité',
	'Arrivée',
	'Trajet',
	'Jours',
	'Heure départ',
	'Heure retour',
	'Prénom',
	'Nom',
	'N° de téléphone',
	'Adresse e-mail',
	'Contact préféré',
	'Moyen de communication préféré',
	'Juste avant de finir, comment avez-vous connu  Lotocar ?',
	'Remarques éventuelles',
	'Type de covoit',
	'Employeur',
	'Contact direct passager',
	'DateProposée'
]

// This generic new header is a simpler version for the next instances (Valber, Mâcon)
const GENERIC_CONDUCTEUR_PROPS = [
	'Date',
	'Départ',
	'Arrivée',
	'Employeur',
	'Jours',
	'Heure départ',
	'Heure retour',
	'Type de covoit',
	'Prénom',
	'Nom',
	'N° de téléphone',
	'Adresse e-mail',
	'Contact préféré',
	'Moyen de communication préféré',
	'Juste avant de finir, comment avez-vous connu  Lotocar ?',
	'Remarques éventuelles',
	'Contact direct passager',
	'DateProposée'
]

const CONDUCTEUR_PROPS =
	process.env.CODE_DEPARTEMENT === '46'
		? LEGACY_CONDUCTEUR_PROPS
		: GENERIC_CONDUCTEUR_PROPS

export default function getDrivers() {
	return new Promise((resolve, reject) => {
		sheets.spreadsheets.values.get(
			{
				spreadsheetId: googleDriverSpreadsheetId,
				range: 'Réponses au formulaire 1'
			},
			(err, res) => {
				if (err) {
					reject(err)
				} else {
					const rows = res.data.values

					// first row is column names, ignoring
					const dataRows = rows.slice(1)

					const conducteurs = dataRows
						.map(row => {
							const conducteur = Object.create(null)

							CONDUCTEUR_PROPS.forEach((prop, i) => {
								conducteur[prop] = row[i]
							})

							return conducteur
						})
						.filter(
							c =>
								c['Départ'] &&
								c['Arrivée'] &&
								(c['N° de téléphone'] || c['Adresse e-mail'])
						)

					resolve(conducteurs)
				}
			}
		)
	})
}
