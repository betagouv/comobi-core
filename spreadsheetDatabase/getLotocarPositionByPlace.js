import { google } from 'googleapis'

const googleAPIKey = process.env.GOOGLE_API_KEY
const googleDriverSpreadsheetId =
	process.env.LOCALISATION_KNOWLEDGE_GOOGLE_SPREADSHEET_ID

const sheets = google.sheets({ version: 'v4', auth: googleAPIKey })

// This function provides local-specific knowledge about positions in the Lot
export default function getLotocarPositionByPlace() {
	return new Promise((resolve, reject) => {
		googleDriverSpreadsheetId == null
			? resolve(new Map())
			: sheets.spreadsheets.values.get(
					{
						spreadsheetId: googleDriverSpreadsheetId,
						range: 'Feuille 1'
					},
					(err, res) => {
						if (err) {
							reject(err)
						} else {
							const rows = res.data.values

							// first row is column names, ignoring
							const dataRows = rows.slice(1)

							const positionByPlace = new Map()

							for (const row of dataRows.filter(row => row.length > 0)) {
								const [namesStr, latitudeStr, longitudeStr] = row

								const names = namesStr
									.split(',')
									.map(n => n.trim())
									.filter(s => s.length >= 1)

								const [latitude, longitude] = [
									latitudeStr,
									longitudeStr
								].map(str => parseFloat(str))

								for (const name of names) {
									if (
										name &&
										name.length >= 1 &&
										Number.isFinite(latitude) &&
										Number.isFinite(longitude)
									)
										positionByPlace.set(name, { latitude, longitude })
								}
							}

							resolve(positionByPlace)
						}
					}
			  )
	})
}
