import { google } from 'googleapis'

const googleAPIKey = process.env.GOOGLE_API_KEY
const googleDriverSpreadsheetId = process.env.GOOGLE_DRIVER_SPREADSHEET_ID

const sheets = google.sheets({ version: 'v4', auth: googleAPIKey });

const CONDUCTEUR_PROPS = [
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
    'Contact direct passager'
]


export default function getDrivers() {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: googleDriverSpreadsheetId,
            range: 'Réponses au formulaire 1',
        }, (err, res) => {
            if (err){
                reject(err)
            }
            else{
                const rows = res.data.values;
    
                // first row is column names, ignoring
                const dataRows = rows.slice(1)
        
                const conducteurs = dataRows.map(row => {
                    const conducteur = Object.create(null);
        
                    CONDUCTEUR_PROPS.forEach((prop, i) => {
                        conducteur[prop] = row[i]
                    })
        
                    return conducteur
                }).filter(c => c['Départ'] && c['Arrivée'] && (c['N° de téléphone'] || c['Adresse e-mail']))

                resolve(conducteurs)
            }
        });
    })
}

