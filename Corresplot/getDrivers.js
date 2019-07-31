import { google } from 'googleapis'

const googleAPIKey = process.env.GOOGLE_API_KEY
const googleDriverSpreadsheetId = process.env.GOOGLE_DRIVER_SPREADSHEET_ID

const sheets = google.sheets({ version: 'v4', auth: googleAPIKey });

const CONDUCTEUR_PROPS = [
    'Départ',
    'Arrivée',
    'Parcours',
    'Conducteurs',
    'Horaires',
    'Contact',
    'Adresse',
    'Mail',
    'Info'
]

const sheetNames = [
    'Vers Cahors',
    'De Cahors',
    'Vers Figeac',
    'De Figeac',
    'Divers Aller',
    'Divers Retour'
]

function getOneSheetDrivers(sheetName){
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: googleDriverSpreadsheetId,
            range: sheetName,
        }, (err, res) => {
            if (err){
                reject(err)
            }
            else{
                const rows = res.data.values;
    
                // First 3 rows are cosmetic ones
                const dataRows = rows.slice(3)
        
                const conducteurs = dataRows.map(row => {
                    const conducteur = {};
        
                    // first element is always blank in spreadsheet
                    row = row.slice(1);
        
                    CONDUCTEUR_PROPS.forEach((prop, i) => {
                        conducteur[prop] = row[i]
                    })
        
                    return conducteur
                }).filter(c => c['Départ'] && c['Arrivée'] && (c['Contact'] || c['Mail']))

                resolve(conducteurs)
            }
        });
    })
}


export default function getDrivers() {
    return Promise.all(sheetNames.map(getOneSheetDrivers))
        .then(driversBySheet => driversBySheet.flat())
}

