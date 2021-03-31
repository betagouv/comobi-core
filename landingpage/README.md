# LandingPage
Ce sous dossier est le site jekyll dédié à la présentation de [CoMobi](http://www.comobi.fr)
Le site est déployé sur Heroku

## Mettre à jour l'application Heroku
Installer le [CLI d'heroku](https://devcenter.heroku.com/articles/heroku-cli)
```
$ cd landingpage
```
Se connecter à Heroku
```
$ heroku login
```
Ajouter le repo en remote
```
$ git remote add https://git.heroku.com/comobi-landingpage.git
```
Déployer les changements
```
$ git add .
$ git commit -am "make it better"
$ git push heroku master
```