# Activilog
![Activilog Logo](https://i.imgur.com/9iWt0IF.png)
>A supervised activity log web application.


## Prerequisites
* nodejs
* npm
* git
* heroku-cli (for deploying test builds).

## Running the node webserver from localhost
Clone this repository
```
$ git clone https://github.com/Perth155/clinicalog && cd clinicalog
```
Install all dependencies and run webpack to create ```bundle.js```
```
$ npm install
$ npm run webpack
```
Start the node webserver
```
$ npm start
```
Project sould be running on ```localhost:3000```.

To start the server on __dev mode__, which uses ```nodemon``` to track any file changes, automatically restarts node if so.
```
$ npm run dev
```

## Deploy on Heroku
By default heroku installs production dependencies only. [To install the devDependencies disable production mode](https://devcenter.heroku.com/articles/nodejs-support)
```
$ heroku config:set NPM_CONFIG_PRODUCTION=false
$ git push heroku master
```
Run the server
```
$ heroku ps:scale web=1
```
Check on the server status
```
$ heroku ps
```
Launch the deployed web app on a web browser
```
$ heroku open
```
[Currently deployed on Heroku](https://activilog.herokuapp.com/)
