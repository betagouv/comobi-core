import { google } from 'googleapis'

const googleAPIKey = process.env.GOOGLE_API_KEY
const googleRequestsSpreadsheetId = process.env.GOOGLE_REQUESTS_SPREADSHEET_ID

const sheets = google.sheets({ version: 'v4', auth: googleAPIKey });

const REQUESTS_COLUMNS = [
    'Date demande', 'Raisons', 'Départ', 'Arrivée', 'Date départ', 'heure départ', 'Motif', 'Retour', 'Heure', 'Prénom', 'Nom', 'N° de téléphone','Adresse e-mail', 'Communication', 'Informations supplémentaires', 'Motif de refus'
]


export default function getDrivers() {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: googleRequestsSpreadsheetId,
            range: 'Réponses au formulaire 1',
        }, (err, res) => {
            if (err){
                reject(err)
            }
            else{
                const rows = res.data.values;
    
                // first row is column names, ignoring
                const dataRows = rows.slice(1)
        
                const requests = dataRows.map(row => {
                    const request = Object.create(null);
        
                    REQUESTS_COLUMNS.slice(0, 9).forEach((prop, i) => {
                        request[prop] = row[i]
                    })
        
                    return request
                })
                .filter(req => req.Arrivée && req.Départ)

                resolve(requests)
            }
        });
    })
}

