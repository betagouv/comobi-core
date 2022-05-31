# Comobi un service de covoiturage

Le projet Comobi est issu du projet [Lot'ô car](https://www.lotocar.fr/).

## Historique [Lot'ô car](https://www.lotocar.fr/)

[Lot'ô car](https://www.lotocar.fr/) a commencé avec une base de données dans un Google Spreadsheet à plusieurs feuilles gérées manuellement//.

Cette gestion et le service par-dessus sont chronophages ; notamment trouver des correspondances entre les conducteur.rice.s et les demandes de trajet. C'est pour cette raison, que nous avons travaillé à d'abord à créer de petits outils indépendants qui permettent de libérer du temps à la personne qui fait ce travail manuellement.

Le volume de données était encore raisonnable pour que Google Spreadsheet soit utile, et avait été retenu pour être utilisé comme base de données principale. Toutefois, l'interface en tableau n'est pas le bon outil pour certaines tâches (notamment la correspondance conducteur.rice.s/trajets). Une interface a donc été développée.

[David Bruant](https://twitter.com/DavidBruant), [dtc innovation](https://dtc-innovation.org/), a été le développeur principal et référent technique du projet pour le moment

### Corresplot

Corresplot est une interface utilisateur permettant de faire la correspondance facilement entre un.e conducteur.rice et une demande de trajet dans le Lot


## Comobi

L'idée est de généraliser et de rendre plus générique le projet Lot'ô car afin qu'il puisse être déployé facilement et rapidement.


### Organisation générale

Le [repository github comobi-core](https://github.com/betagouv/comobi-core) contient ce qui est commun à toutes les instances (notamment le serveur qui discute avec la base de données) 

Chaque instance est créé comme un repo github contenant uniquement les fichiers de contenu (textes, image, etc.) spécifiques à cette instance. Voir le [repo betagouv/neutre.comobi.fr](https://github.com/betagouv/neutre.comobi.fr) en exemple.

Chaque instance, au déploiement, tire la dernière version de la branche `main` de `comobi-core` et redéploie la combinaison de comobi-core et de ses propres fichiers

Actuellement, et pour des raisons historiques, les données sont stockées dans un Google Spreadsheet alimenté par les réponses à un Google Form. [Nous planifions de transitionner vers une base de données MongoDB](https://github.com/betagouv/comobi-core/issues/30)


### Architecture

- [Jekyll](jekyllrb.com/) permet de gérer la partie statique de l'application web :
  - `_includes`: les éléments pouvants être partagés entre les pages
  - `_layout`: les templates des pages
  - `_sass`: les fichiers de styles
- Le framework [Svelte](svelte.dev/) est utilisé pour les composants d'interface (en particulier aujourd'hui le formulaire de recherche)
  - `_scripts` : le code côté client dont les composants d'interface
- [Express](expressjs.com) est utilisé pour la partie serveur. Les fichiers sont séparés en différents sous dossiers et utilisés à la fois par l'application principale mais pouvant être utilisée par l'application 'outil-métier' (qui n'est pas encore utilisé dans le cadre de CoMobi)
  - `server` : fonctions en rapport avec les trajets et les lieux
  - `spreadsheetDatabase` : les fonctions permettant d'accèder aux données
  - `server.js` : instanciation d'une application express et gestion des routes
- les pages statiques en markdown:
  - `index.md`
  - `recherche.md`

#### Ajouter une nouvelle page

- ajouter une page __.md___
- ajouter une route dans le fichier server.js

#### Base de connaissance de localisation

Parfois des communes sont fusionnées ou alors, les personnes habitant quelque part utilisent des noms pour les lieux qui ne sont pas les noms officiels (source gouvernementale) ou utilisés dans les API existantes. Ou alors, elles utilisent des noms raccourcis ambigus (dans le Lot, quand on parle de "Villeneuve", il est évident duquel on parle, alors qu'il existe plusieurs villes en France avec le nom "Villeneuve")
Pour ces cas-là, nous mettons en place un Google Spreadsheet qui permet de consigner cette connaissance locale

Ce Google Spreadsheet contient 3 colonnes :

- noms
  - on peut rentrer plusieurs noms en les séparant par des virgules afin de leur assigner la même position
- latitude
- longitude

Pour trouver les **latitude/longitude**, une manière de faire consiste à aller dans Google Maps, viser le lieu que l'on souhaite, faire un **clic droit**, sélectionner "Plus d'infos sur cet endroit" et en bas de l'écran, on peut voir les latitude/longitude


### Pour développer en local

#### Première fois

- Créer un fichier `_config.yml` (par exemple, en prenant ce modèle : https://github.com/betagouv/neutre.comobi.fr/blob/main/_config.yml )
- Créer un projet dans la [console Google](https://console.developers.google.com)
- Créer une "clé API" (pas Oauth)
- Créer un fichier `.env` avec les variables d'environnement:
  - `GOOGLE_API_KEY` : clef d'API créée ci-dessus
  - `GOOGLE_DRIVER_SPREADSHEET_ID` : identifiant du Google Spreadsheet qui sert de base de donnée

Lancer
```sh
# Pour créer un premier build, avec notamment la création du dossier _site
npm run build:jekyll
```


#### Au quotidien

Pour lancer l'application "trajets direct" : 

```sh
npm run dev # start server
```

### Déploiement sur Clever Cloud

Lorsque la branche `main` est modifiée un build automatique est lancé via une github action comprenant les étapes suivantes : 
  - build du JS front-end
  - build de l'application avec jekyll
  - `git push` sur une branche nommée `deploy`
Sur Clever Cloud un build automatique est lancé quand la branche `deploy` est mise à jour sur github

### Langue

- Documentation en français
- Code et messages de commit en anglais

## Licence

[MIT](LICENCE)
