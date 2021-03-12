// @ts-check
/**
 * @typedef {Object} Trip
 * @property {string} origin
 * @property {string} destination
 */

 /**
 * @typedef {Object} Driver
 * @property {string} modeContact
 * @property {string} contact
 * @property {string} lieu
 * /

 /**
 * @typedef {Object} TripProposal
 * @property {string} Départ
 * @property {string} Arrivée
 * @property {string} Trajet
 * @property {string} Jours
 * @property {string} Jour
 * @property {Driver} driver
 */

 /**
 * @typedef {Object} Position
 * @property {number} latitude
 * @property {number} longitude
 */

 /**
  * @typedef {Object} TripDetails
  * @property {number} [originalDistance=0]
  * @property {number} [distanceWithDetour=Infinity]
  */