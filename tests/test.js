import test from 'ava'
import { keepRelevantDrivers } from '../spreadsheetDatabase/getDrivers'
import { format, subDays  } from 'date-fns'
import Store from 'baredux'
import _actions from '../_scripts/actions.js'

/*const CONDUCTEUR_PROPS = [
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
]*/

const tripWithoutDate = [
  '04/02/2021 17:48:14',
  'agde',
  'sète',
  '',
  '',
  '',
  '10:00:00',
  '10:00:00',
  'Le covoiturage régulier (partage des frais à définir avec le passager, ou alternance de véhicule etc.), Le covoiturage ponctuel et gratuit, pour rendre service à une personne de temps en temps (recommandé par Lotocar)',
  'Sabine',
  'test',
  '0898765433',
  'tst@test.com',
  'SMS',
  'Bouche à Oreille',
  'Je consens'
]

/*const recurrentTrip = [
  '04/02/2021 17:59:27',
  'Lattes',
  'Montpellier',
  '',
  'Lundi, Jeudi',
  '',
  '06:00:00',
  '17:00:00',
  'Le covoiturage régulier (partage des frais à définir avec le passager, ou alternance de véhicule etc.)',
  'Test',
  'Test',
  '+336000000',
  'tst@test.com',
  'Email',
  'Prospectus, Flyer',
  'Je consens'
]*/

const tripWithDateInThePast = [
  '04/02/2021 17:59:27',
  'Sète',
  'Montpellier',
  '',
  '',
  format(subDays(new Date(), 1), 'dd/MM/yyyy'),
  '06:00:00',
  '17:00:00',
  'Le covoiturage régulier (partage des frais à définir avec le passager, ou alternance de véhicule etc.)',
  'Test',
  'Test',
  '+336000000',
  'tst@test.com',
  'Email',
  'Prospectus, Flyer',
  'Je consens'
]

const tripWithTodayDate = [
  '04/02/2021 17:59:27',
  'Sète',
  'Montpellier',
  '',
  '',
  format(new Date(), 'dd/MM/yyyy'),
  '06:00:00',
  '17:00:00',
  'Le covoiturage régulier (partage des frais à définir avec le passager, ou alternance de véhicule etc.)',
  'Test',
  'Test',
  '+336000000',
  'tst@test.com',
  'Email',
  'Prospectus, Flyer',
  'Je consens'
]

// Test getDrivers() function
test('server should not be send trip with no date', t => {
  const dataRowTest = [ tripWithoutDate ]
  const relevantDrivers = keepRelevantDrivers(dataRowTest)
  t.is(relevantDrivers.length, 0);
});

test('server should send trip with today date', t => {
  const dataRowTest = [ tripWithDateInThePast ]
  const relevantDrivers = keepRelevantDrivers(dataRowTest)
  t.is(relevantDrivers.length, 0);
});

test('server should not be send trip with date in the past', t => {
  const dataRowTest = [ tripWithTodayDate ]
  const relevantDrivers = keepRelevantDrivers(dataRowTest)
  t.is(relevantDrivers.length, 1);
});

//
const tripFromSèteToMontpellier = [
  '04/02/2021 17:59:27',
  'Sète',
  'Montpellier',
  '',
  '',
  format(new Date(), 'dd/MM/yyyy'),
  '06:00:00',
  '17:00:00',
  'Le covoiturage régulier (partage des frais à définir avec le passager, ou alternance de véhicule etc.)',
  'Test',
  'Test',
  '+336000000',
  'tst@test.com',
  'Email',
  'Prospectus, Flyer',
  'Je consens'
]
test('trip that correspond to the search from Sète to Montpellier should be displayed', t => {

});
