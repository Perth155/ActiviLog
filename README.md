# Activilog
![Activilog Logo](https://i.imgur.com/9iWt0IF.png)
>A supervised activity log web application.


## Prerequisites
* nodejs
* npm
* git
* heroku-cli (for deploying test builds using herokuapp.).

## Running the node webserver from localhost
Clone this repository
```
$ git clone https://github.com/activilog/activilog.git && cd activilog
```
Install all dependencies and run webpack to create ```bundle.js```
```
$ npm install
$ npm run webpack
```
The web application should be running on ```localhost:3000```

## Deploy on Heroku
Add remote
```
$ heroku git:remote -a activilog
```

By default heroku installs production dependencies only. To install the dev dependencies [disable production mode](https://devcenter.heroku.com/articles/nodejs-support)
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


## TODO
* Add seperate PROD database (via config.json file to be gitignored)
* Add email client to verify accounts to prevent spam accounts/ bots.
* Make the "Add Account" Feature a "Send Invitation" feature instead (admin shouldn't be able to reset user PW anymore).
* Get plots working... Use existing npm packages for this potentially.
