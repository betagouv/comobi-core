import { google } from 'googleapis'
import { parse, isBefore, addDays } from 'date-fns'

const googleAPIKey = process.env.GOOGLE_API_KEY
const googleDriverSpreadsheetId = process.env.GOOGLE_DRIVER_SPREADSHEET_ID

const sheets = google.sheets({ version: 'v4', auth: googleAPIKey })

const CONDUCTEUR_PROPS = [
	'Date',
	'Départ',
	'Arrivée',
	'Lieu précis',
	'Jours',
	'Jour',
	'Heure départ',
	'Heure retour',
	'Type de covoit',
	'Prénom',
	'Nom',
	'N° de téléphone',
	'Adresse e-mail',
	'Contact préféré',
	'Communication',
	'Consentement',
	'Remarques éventuelles'
]

export const keepRelevantDrivers = (dataRows) => {
	return dataRows
		.map(row => {
			const conducteur = Object.create(null)
			CONDUCTEUR_PROPS.forEach((prop, i) => {
				conducteur[prop] = row[i]
			})
			return conducteur
		})
		.filter(
			c => {
				let date
				const jour = c['Jour']
				if (jour) {
					date = addDays(parse(jour, 'dd/MM/yyyy', new Date()), 1)
				}
				return c['Départ'] &&
				c['Arrivée'] &&
				(c['N° de téléphone'] || c['Adresse e-mail']) &&
				(c['Jours'] || (c['Jour'] && isBefore(new Date(), date)))
			}
		)
}

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
					resolve(keepRelevantDrivers(dataRows))
				}
			}
		)
	})
}
