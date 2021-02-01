# Comobi un service de covoiturage

Le projet Comobi est issu du projet [Lot'ô car](https://www.lotocar.fr/).

## Historique [Lot'ô car](https://www.lotocar.fr/)
[Lot'ô car](https://www.lotocar.fr/) a commencé avec une base de données dans un Google Spreadsheet à plusieurs feuilles gérée manuellement//.

Cette gestion et le service par-dessus sont chronophages ; notamment trouver des correspondances entre les conducteur.rice.s et les demandes de trajet. C'est pour cette raison, que nous avons travailler à d'abord à créer de petits outils indépendants qui permettent de libérer du temps à la personne qui fait ce travail manuellement.

Le volume de données était encore raisonnable pour que Google Spreadsheet soit utile, et avait été retenu pour être utilisé comme base de données principale. Toutefois, l'interface en tableau n'est pas le bon outil pour certaines tâches (notamment la correspondance conducteur.rice.s/trajets). Une interface a donc été développée.

[David Bruant](https://twitter.com/DavidBruant), [dtc innovation](https://dtc-innovation.org/), a été le développeur principale et référent technique du projet pour le moment

### Corresplot

Corresplot est une interface utilisateur permettant de faire la correspondance facilement entre un.e conducteur.rice et une demande de trajet dans le Lot

[Organisation du travail](https://github.com/DavidBruant/lotocar/projects/1?fullscreen=true)

### Architecture
Deux applications sont disponibles : 'Direct' et 'Outil-metier'

## Comobi
L'idée est de généraliser et de rendre plus générique le projet Lot'ô car afin qu'il puisse être déployée facilement et rapidement.

### Architecture
- Jekyll permet de gérer la partie statique de l'application web :
  - _includes: les éléments pouvants être partagés entre les pages
  - _layout: les template des pages
  - _sass: les fichiers de styles
- Le framework React est utilisé pour les composants (en particulier aujourd'hui le formulaire de recherche)
  - _scripts : les composants
- Express est utilisé pour la partie serveur. Les fichiers sont séparés en différents sous dossiers et utilisés à la fois par l'application principale mais pouvant être utilisée par l'application 'outil-métier' (qui n'est pas encore utilisé dans le cadre de CoMobi)
  - server : fonctions en rapport avec les trajets et les lieux
  - spreadsheetDatabase : les fonctions permettant d'accèder aux données
  - server.js : instanciation d'une application express et gestion des routes
- les pages statiques en markdown:
  - index.md
  - recherche.md

#### Base de connaissance de localisation

Parfois des communes sont fusionnées ou alors, les personnes habitant quelque part utilisent des noms pour les lieux qui ne sont pas les noms officiels (source gouvernementale) ou utilisée dans les API existantes. Ou alors, elles utilisent des noms raccourcis ambigües (dans le Lot, quand on parle de "Villeneuve", il est évident duquel on parle, alors qu'il existe plusieurs villes en France avec le nom "Villeneuve")
Pour ces cas-là, nous mettons en place un Google Spreadsheet qui permet de consigner cette connaissance locale

Ce Google Spreadsheet contient 3 colonnes :

- noms
  - on peut rentrer plusieurs noms en les séparant par des virgules afin de leur assigner la même position
- latitude
- longitude

Pour trouver les **latitude/longitude**, une manière de faire consiste à aller dans Google Maps, viser le lieu que l'on souhaite, faire un **clic droit**, sélectionner "Plus d'infos sur cet endroit" et en bas de l'écran, on peut voir les latitude/longitude

### Installation
- Créer un projet dans la [console Google](https://console.developers.google.com)
- Créer une "clé API" (pas Oauth)
- Créer un fichier `.env` avec les variables d'environnement:
  - `GOOGLE_API_KEY` : clef d'API créée ci-dessus
  - `GOOGLE_DRIVER_SPREADSHEET_ID` : identifiant du Google Spreadsheet qui sert de base de donnée
  - `LOCALISATION_KNOWLEDGE_GOOGLE_SPREADSHEET_ID` : identifiant du Google Spreadsheet qui sert de base de connaissance pour la localisation

### Pour développer en local

Pour lancer l'application "trajets direct" : 
```
$ npm run dev:direct // build, create frontend_build and update _site
$ npm run dev // start server
```

### Déploiement sur heroku
Lorsque la branche master est déployée un build automatique est lancé par github comprenant les étapes suivantes : 
  - build des scripts react
  - build de l'application avec jekyll
  - mise a jour d'une branche nommée Heroku
Sur heroku un build automatique est lancé quand la branche heroku est mise à jour sur github

### Langue

- Documentation en français
- Code et messages de commit en anglais

## Licence

[MIT](LICENCE)
