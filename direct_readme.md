# Mise en relation directe

L'idée a emergé fin septembre début octobre de mettre en place une plateforme qui permette aux conducteur.rice.s et passager.ère.s de Lotocar de se contacter directement sans l'intémédiaire d'une personne dédiée à cette tâche

Nous nous sommes vu.e.s le lundi 7 octobre 2019 à Toulouse pour discuter des problèmes que cette plateforme résoud, des personnes concernées et pour commencer un peu de design

Il en résulte : 
- [un board avec des *user story* et des tâches](https://github.com/DavidBruant/lotocar/projects/3?fullscreen=true)
- [des maquettes d'écrans](../design/maquettes)
- une stratégie de déploiment (section suivante)


## Stratégie

### Déploiement

#### MVP

- Le lien sur lotocar.fr pour demander un covoiturage mène vers une page sur un sous-domaine dédié (genre http://trajets.lotocar.fr/ ) qui permet aux passager.ère.s de chercher des conducteur.rice.s pertinent.e.s par critère géographique
- Les résultats sont anonymisés
- Un bouton permet de contacter le.a conducteur.rice. Ce bouton révèle (sous réserve de consentement):
    - le numéro de téléphone (selon la préférence)
    - l'adresse email (selon la préférence)
    - le contact de Lotocar si la personne n'a fourni de consentement pour aucun

##### Comment

90% du code existe déjà dans [Corresplot](../Corresplot) et le [serveur](../server)
Il manque :
- receuillir le consentement (dont création de colonne dédiée dans le Google Spreadsheet)
- affichage anonymisé
- le bouton de révélation
- peut-être mettre mieux en valeur les jours/heures


#### Juste après

- Ptèt mettre en place une adresse email pour que les personnes remontent les problèmes
- Des analytics pour avoir de la visibilité sur les demandes et les résultats affichés
- http**S**://trajets.lotocar.fr/
- Ne pas envoyer côté client les données privées (même si elles ne sont pas affichées)
- Les passager.ère.s n'ont accès aux données de contact qu'après avoir partager leurs données (email valide,  nom, prénom, téléphone ?)
- Analytics pour savoir qui a eu accès au contact de qui
- on leur envoie un email de confirmation avec une [capability URL](https://w3ctag.github.io/capability-urls/) qui leur permet de chercher + contacter
    - le morceau secret est stocké dans le localStorage pour que la personne aie accès à leur page "privée", même en passant par la version anonyme
    - le local storage contient toujours la dernière recherche (anonyme ou pas)


#### Plus tard

- conducteur.rice.s peuvent déclarer un trajet ponctuel ou régulier
- conducteur.rice.s peuvent "créer un compte" (on leur envoie un email avec une capability URL)
    - on peut garder le formulaire GForm (afin de s'économiser l'effort de le refaire) et mettre en place un hook Google Script pour créer le morceau secret + email
- conducteur.rice.s peuvent éditer leurs infos
- quand le.a conducteur.rice préfère être contacté.e par email, on fournit un formulaire. Ce formulaire envoie l'email en tant que Lotocar, mais avec la vraie adresse email en `Reply to`
- On peut mettre en place un mécanisme équivalent pour les SMS



### Considérations transverses

- Grosse considération de compatibilité
    - web
        - Développement *mobile-first* 
        - polyfills
        - babel
- Sécurité - Privacy
    - pas de partage d'info privée sans consentement
    - pas de mot de passe, uniquement des capability URLs envoyées par email + site web en HTTPS
        - la sécurité des infos Lotocar d'une personne repose principalement sur la sécurité de l'adresse email de cette personne
- Relation à Wix
    - on garde Wix pour la page d'acceuil parce que ça fait du travail en plus de l'enlever
    - d'où le sous-domaine `trajets.lotocar.fr`
