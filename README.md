# Lotocar [![Build Status](https://travis-ci.org/DavidBruant/lotocar.svg?branch=master)](https://travis-ci.org/DavidBruant/lotocar)

Le projet [Lot'ô car](https://www.lotocar.fr/) a commencé avec une base de données dans un Google Spreadsheet à plusieurs feuilles gérée manuellement

Cette gestion et le service par-dessus sont chronophages ; notamment trouver des correspondances entre les conducteur.rice.s et les demandes de trajet

Pour cette raison, nous travaillons d'abord à créer des petits outils indépendants qui permettent de libérer du temps à la personne qui fait ce travail manuellement

Le volume de données est encore raisonnable pour que Google Spreadsheet soit utile, donc nous allons continuer à l'utiliser comme base de données principale. Toutefois, l'interface en tableau n'est pas le bon outil pour certaines tâches (notamment la correspondance conducteur.rice.s/trajets). Nous allons donc faire d'autres interfaces par-dessus

Pour commencer, [David Bruant](https://twitter.com/DavidBruant), [dtc innovation](https://dtc-innovation.org/), sera le développeur principale et référent technique du projet pour le moment

## Corresplot

Corresplot est une interface utilisateur permettant de faire la correspondance facilement entre un.e conducteur.rice et une demande de trajet dans le Lot

[Organisation du travail](https://github.com/DavidBruant/lotocar/projects/1?fullscreen=true)

### Architecture

- Une interface web qui permet de visualiser les données sur une carte pour plus facilement
- Un service hébergé sur [Heroku](https://www.heroku.com/)
  - discute avec le Google Spreadsheet qui sert de base de données et fournit les données au front-end
  - discute avec un service de trajets pour pouvoir dessiner les trajets en voiture
    - Sûrement [Google Directions API](https://developers.google.com/maps/documentation/directions/start) pour le moment
      - Sûrement mettre en place un cache afin de stocker les résultats et les réutiliser sans refaire des appels à l'API qui est payante
    - Peut-être [l'API Itinéraires de l'IGN](https://geoservices.ign.fr/documentation/geoservices/itineraires.html) qui sera gratuite pour le Service Public, mais dont l'inscription a l'air plus relou à très court terme

#### Heroku

Il y a 2 applis : "outil métier" (plutôt interne à l'équipe Lotocar) et "direct" (plutôt publique pour que les personnes se mettent en relation entre elles).
Il y a une partie serveur et une app Heroku par application

Chaque application a son Procfile. On utilise le [heroku-buildpack-multi-procfile](https://github.com/heroku/heroku-buildpack-multi-procfile) à cet effet

### Installation

- Créer un projet dans la [console Google](https://console.developers.google.com)
- Créer des accès pour l'API Google Sheet et spécifiquement une "clé API" (pas Oauth)
- Créer un fichier `.env` avec les variables d'environnement:
  - `GOOGLE_API_KEY` : clef d'API créée ci-dessus
  - `GOOGLE_DRIVER_SPREADSHEET_ID` : identifiant du Google Spreadsheet qui sert de base de donnée
  - `LOCALISATION_KNOWLEDGE_GOOGLE_SPREADSHEET_ID` : identifiant du Google Spreadsheet qui sert de base de connaissance pour la localisation
- Dupliquer ce `.env` à la fois dans `outil-metier` et dans `direct`

#### Pour développer en local

Pour lancer l'application "trajets direct" : `npm run dev`.
Pour lancer l'application "outil métier" : `npm run dev:outil-metier`.

#### Start

Pour faire tourner le serveur de production de ces deux applications.

```sh
npm run start # Pour l'applciation "trajets direct"
npm run start:outil-metier
```

#### Base de connaissance de localisation

Parfois des communes sont fusionnées ou alors, les personnes habitant quelque part utilisent des noms pour les lieux qui ne sont pas les noms officiels (source gouvernementale) ou utilisée dans les API existantes. Ou alors, elles utilisent des noms raccourcis ambigües (dans le Lot, quand on parle de "Villeneuve", il est évident duquel on parle, alors qu'il existe plusieurs villes en France avec le nom "Villeneuve")
Pour ces cas-là, nous mettons en place un Google Spreadsheet qui permet de consigner cette connaissance locale

Ce Google Spreadsheet contient 3 colonnes :

- noms
  - on peut rentrer plusieurs noms en les séparant par des virgules afin de leur assigner la même position
- latitude
- longitude

Pour trouver les **latitude/longitude**, une manière de faire consiste à aller dans Google Maps, viser le lieu que l'on souhaite, faire un **clic droit**, sélectionner "Plus d'infos sur cet endroit" et en bas de l'écran, on peut voir les latitude/longitude

### Langue

- Documentation en français
- Code et messages de commit en anglais

## Licence

[MIT](LICENCE)
