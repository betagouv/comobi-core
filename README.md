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


### Installation

- Créer un projet dans la [console Google](https://console.developers.google.com)
- Créer des accès pour l'API Google Sheet et spécifiquement une "clé API" (pas Oauth)
- Créer un fichier `.env` avec les variables d'environnement:
    - `GOOGLE_API_KEY` : clef d'API créée ci-dessus
    - `GOOGLE_DRIVER_SPREADSHEET_ID` : identifiant du Google Spreadsheet qui sert de base de donnée

## Conventions

### Langue

- Documentation en français
- Code et messages de commit en anglais


## Licence

[MIT](LICENCE)