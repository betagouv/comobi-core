import { google } from 'googleapis'

const googleAPIKey = process.env.GOOGLE_API_KEY
const googleRequestsSpreadsheetId = process.env.GOOGLE_REQUESTS_SPREADSHEET_ID

const sheets = google.sheets({ version: 'v4', auth: googleAPIKey });

import {REQUEST_STATUS_KEY} from './requestStatusConstants.js'

// TODO Change key format
const REQUESTS_COLUMNS = [
    'Date demande', 'Raisons', 'Départ', 'Arrivée', 'Date départ', 'heureDepart', 'Motif', 'Retour', 'Heure', 'Prénom', 'Nom', 'N° de téléphone','Adresse e-mail', 'Communication', 'Informations supplémentaires', 'Motif de refus', REQUEST_STATUS_KEY
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
        
                    [...REQUESTS_COLUMNS.slice(0, 9), REQUEST_STATUS_KEY].forEach((prop) => {
                        const index = REQUESTS_COLUMNS.indexOf(prop);
                        request[prop] = row[index];
                    })
        
                    return request
                })
                .filter(req => req.Arrivée && req.Départ)

                resolve(requests)
            }
        });
    })
}

