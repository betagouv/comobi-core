import test from 'ava'
import { keepRelevantDrivers } from '../spreadsheetDatabase/getDrivers.js'
import { format, subDays  } from 'date-fns'
import { getAdditionnalTimeByTrip, getRelevantTrip } from '../server/findRelevantTripProposals.js';

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
test('server should not send trip with no date', t => {
  const dataRowTest = [ tripWithoutDate ]
  const relevantDrivers = keepRelevantDrivers(dataRowTest)
  t.is(relevantDrivers.length, 0);
});

test('server should not send trip with date in the past', t => {
  const dataRowTest = [ tripWithDateInThePast ]
  const relevantDrivers = keepRelevantDrivers(dataRowTest)
  t.is(relevantDrivers.length, 0);
});

test('server should send trip with today date', t => {
  const dataRowTest = [ tripWithTodayDate ]
  const relevantDrivers = keepRelevantDrivers(dataRowTest)
  t.is(relevantDrivers.length, 1);
});

const tripRequest = { origin: "castries", destination: "montpellier" };

let tripProposalsByTrip = new Map()
let trip = { origin: "castries", destination: "montpellier" }
tripProposalsByTrip.set(trip, [{
    "Arrivée": "montpellier",
    "Départ": "castries",
    "Heure départ": "08:00:00",
    Jour: "",
    Jours: "Lundi, Mardi, Mercredi, Jeudi, Vendredi",
    driver: {
      Nom: "B.",
      "Prénom": "audrey",
      contact: "comobi@beta.gouv.fr",
      lieu: "Corum",
      modeContact: "Email"
    }
  }])
trip = { origin: "paris", destination: "toulon" }
tripProposalsByTrip.set(trip, [{
  "Arrivée": "paris",
  "Départ": "toulon",
  "Heure départ": "08:00:00",
  Jour: "",
  Jours: "Lundi, Mardi, Mercredi, Jeudi, Vendredi",
  driver: {
    Nom: "B.",
    "Prénom": "audrey",
    contact: "comobi@beta.gouv.fr",
    lieu: "Corum",
    modeContact: "Email"
  }
}])
trip = { origin: "clapiers", destination: "montpellier" }
tripProposalsByTrip.set(trip, [{
  "Arrivée": "clapiers",
  "Départ": "montpellier",
  "Heure départ": "08:00:00",
  Jour: "",
  Jours: "Lundi, Mardi, Mercredi, Jeudi, Vendredi",
  driver: {
    Nom: "B.",
    "Prénom": "audrey",
    contact: "comobi@beta.gouv.fr",
    lieu: "Corum",
    modeContact: "Email"
  }
}])

const positionByPlace = new Map(Object.entries({ 
  "castries": { latitude: 43.6183, longitude: 3.8592 },
  "montpellier": { latitude: 43.610769, longitude: 3.876716 },
  "clapiers": { latitude: 43.65, longitude: 3.8833 },
  "paris": { latitude: 48.8566969, longitude: 2.3514616 },
  "toulon": { latitude: 43.1257311, longitude: 5.9304919 },
}));

test('additionnal trip according to { origin: "castries", destination: "montpellier" } should correctly been computed', t => {
  const additionalTimeByTrip = getAdditionnalTimeByTrip(tripRequest, tripProposalsByTrip, positionByPlace);
  t.is(additionalTimeByTrip[0].additionalTime, 0);
  t.is(additionalTimeByTrip[1].additionalTime, 105.8660527271877);
  t.is(additionalTimeByTrip[2].additionalTime, 1.776497541647744 );
});

test('trip with additionnal time less than five minutes should been returned', t => {
  const additionalTimeByTrip = getAdditionnalTimeByTrip(tripRequest, tripProposalsByTrip, positionByPlace);
  const relevantTrip = getRelevantTrip(tripProposalsByTrip, additionalTimeByTrip, time => time < 5)
  t.is(relevantTrip.length, 2)
});

test('trip with additionnal time between 20 and 45 minutes should been returned', t => {
  const additionalTimeByTrip = getAdditionnalTimeByTrip(tripRequest, tripProposalsByTrip, positionByPlace);
  const relevantTrip = getRelevantTrip(tripProposalsByTrip, additionalTimeByTrip, time => time > 45)
  t.is(relevantTrip.length, 1)
});
