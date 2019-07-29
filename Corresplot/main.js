const { google } = require('googleapis');

const apiKey = require('../google-api-credentials.json')
const spreadsheetIds = require('../google-spreadsheet-ids.json')

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


function listConducteurs() {
    const sheets = google.sheets({ version: 'v4', auth: apiKey.key });

    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetIds.conducteurs,
        range: 'Vers Cahors',
    }, (err, res) => {
        if (err){
            console.log('The API returned an error:', err);
            return ;
        }
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

        console.log('conducteurs', conducteurs.length, conducteurs)
    });
}

listConducteurs()